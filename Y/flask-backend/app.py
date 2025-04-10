import os
import json
import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import db_config

app = Flask(__name__)
CORS(app)

# Define the database folder and social_data.json path
database_folder = os.path.join(os.getcwd(), "database")
os.makedirs(database_folder, exist_ok=True)
social_data_path = os.path.join(database_folder, "social_data.json")

# Configure the database using config.py
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'SuperDuperSecretKey'

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Ensure social_data.json exists
if not os.path.exists(social_data_path):
    with open(social_data_path, "w") as f:
        json.dump({"users": []}, f, indent=4)

# Define User model for SQLAlchemy
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create DB tables
with app.app_context():
    db.create_all()

# Register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    # Load existing social data
    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                social_data = {"users": []}
    else:
        social_data = {"users": []}

    # Add new user to social data with default role
    new_user_data = {
        "id": new_user.id,
        "username": new_user.username,
        "role": "User",  # Default role
        "user-made": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime()),
        "posts": [],
        "following": [],
        "followers": []
    }
    social_data["users"].append(new_user_data)

    # Save social data
    with open(social_data_path, "w") as f:
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

# Protected test route
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    
    # Fetch user role from social_data.json
    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"message": "Error reading social data"}), 500
    else:
        return jsonify({"message": "Social data file not found"}), 500

    user_info = next((user for user in social_data["users"] if user["username"] == current_user), None)
    if user_info:
        role = user_info.get("role", "User")
        return jsonify(message=f"You have logged in, {current_user}, Role: {role}"), 200
    return jsonify({"message": "User not found"}), 404

# Create a new post
@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    message = data.get('message', '')
    hashtags = data.get('hashtags', [])
    username = get_jwt_identity()

    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"message": "Error reading social data"}), 500
    else:
        return jsonify({"message": "Social data file not found"}), 500

    user_found = False
    for user in social_data.get("users", []):
        if user.get("username") == username:
            post = {
                "id": int(time.time() * 1000),
                "message": message,
                "hashtags": hashtags,
                "timestamp": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
            }
            user.setdefault("posts", []).insert(0, post)
            user_found = True
            break

    if not user_found:
        return jsonify({"message": "User not found in social data"}), 404

    with open(social_data_path, "w") as f:
        json.dump(social_data, f, indent=4)

    return jsonify({"message": "Post created successfully"}), 201

# Get latest posts
@app.route('/posts', methods=['GET'])
def get_posts():
    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"posts": []}), 500
    else:
        return jsonify({"posts": []}), 404

    all_posts = []
    for user in social_data.get("users", []):
        for post in user.get("posts", []):
            post_with_user = post.copy()
            post_with_user["username"] = user["username"]
            all_posts.append(post_with_user)

    all_posts.sort(key=lambda x: x["id"], reverse=True)
    posts_to_return = all_posts[:30]

    return jsonify({"posts": posts_to_return}), 200

# Delete a post endpoint
@app.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    current_user = get_jwt_identity()

    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"message": "Error reading social data"}), 500
    else:
        return jsonify({"message": "Social data file not found"}), 500

    # Check if the current user is an admin
    user_info = next((user for user in social_data["users"] if user["username"] == current_user), None)
    if not user_info:
        return jsonify({"message": "User not found"}), 404

    # Allow admins to delete any post
    if user_info.get("role") == "Admin":
        # Find and delete the post from all users
        for user in social_data.get("users", []):
            user["posts"] = [post for post in user.get("posts", []) if post["id"] != post_id]

    else:
        # Regular users can only delete their own posts
        user_found = False
        for user in social_data.get("users", []):
            if user.get("username") == current_user:
                user["posts"] = [post for post in user.get("posts", []) if post["id"] != post_id]
                user_found = True
                break

        if not user_found:
            return jsonify({"message": "User not found in social data"}), 404

    # Save the updated social data
    with open(social_data_path, "w") as f:
        json.dump(social_data, f, indent=4)

    return jsonify({"message": "Post deleted successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
