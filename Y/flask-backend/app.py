import os
import json
import time
import random
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure the database and JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Using SQLite for simplicity
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change this to a strong secret for production

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Define a User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create the database if it doesn't exist
with app.app_context():
    db.create_all()

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Update the JSON file with the new user's data
    json_filename = "social_data.json"
    if os.path.exists(json_filename):
        with open(json_filename, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                social_data = {"users": []}
    else:
        social_data = {"users": []}

    new_user_data = {
        "id": new_user.id,
        "username": new_user.username,
        "posts": [],
        "following": [],
        "followers": []
    }
    social_data["users"].append(new_user_data)

    with open(json_filename, "w") as f:
        json.dump(social_data, f, indent=4)

    return jsonify({"message": "User created successfully"}), 201

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

# Protected endpoint (only accessible with valid JWT)
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(message=f"You have logged in, {current_user}"), 200

# New Post endpoint: Create a post and update the JSON file
@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    message = data.get('message', '')
    hashtags = data.get('hashtags', [])
    username = get_jwt_identity()

    json_filename = "social_data.json"
    if os.path.exists(json_filename):
        with open(json_filename, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"message": "Error reading social data"}), 500
    else:
        return jsonify({"message": "Social data file not found"}), 500

    user_found = False
    for user in social_data.get("users", []):
        if user.get("username") == username:
            # Create a new post with a unique id (using current time in milliseconds)
            post = {
                "id": int(time.time() * 1000),
                "message": message,
                "hashtags": hashtags
            }
            # Insert the new post at the beginning so it appears at the top
            user.setdefault("posts", []).insert(0, post)
            user_found = True
            break

    if not user_found:
        return jsonify({"message": "User not found in social data"}), 404

    with open(json_filename, "w") as f:
        json.dump(social_data, f, indent=4)

    return jsonify({"message": "Post created successfully"}), 201

# New endpoint: Get up to 10 random posts from the JSON file
@app.route('/posts', methods=['GET'])
def get_posts():
    json_filename = "social_data.json"
    if os.path.exists(json_filename):
        with open(json_filename, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"posts": []}), 500
    else:
        return jsonify({"posts": []}), 404

    all_posts = []
    # Gather posts from all users, and attach the username to each post
    for user in social_data.get("users", []):
        for post in user.get("posts", []):
            post_with_user = post.copy()
            post_with_user["username"] = user["username"]
            all_posts.append(post_with_user)

    # Shuffle and select up to 10 random posts
    random.shuffle(all_posts)
    posts_to_return = all_posts[:10]

    return jsonify({"posts": posts_to_return}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Update host to 0.0.0.0 for network access