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

# Define the database folder for social_data.json
database_folder = os.path.join(os.getcwd(), "database")
os.makedirs(database_folder, exist_ok=True)

# Configure SQLAlchemy to use the configuration from config.py
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'SuperDuperSecretKey' # Session encryption key 

# Initialize SQLAlchemy
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Path for social_data.json
social_data_path = os.path.join(database_folder, "social_data.json")

# Ensure social_data.json exists
if not os.path.exists(social_data_path):
    with open(social_data_path, "w") as f:
        json.dump({"users": []}, f, indent=4)

# Define a User model for MariaDB
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create the database tables if they don't exist
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

    # Load social data from JSON file
    if os.path.exists(social_data_path):
        with open(social_data_path, "r") as f:
            try:
                social_data = json.load(f)
            except json.JSONDecodeError:
                social_data = {"users": []}
    else:
        social_data = {"users": []}

    # Append new user data
    new_user_data = {
        "id": new_user.id,
        "username": new_user.username,
        "posts": [],
        "following": [],
        "followers": []
    }
    social_data["users"].append(new_user_data)

    # Save updated social data back to the JSON file
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

# Protected endpoint
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(message=f"You have logged in, {current_user}"), 200

# Create Post endpoint
@app.route('/post', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    message = data.get('message', '')
    hashtags = data.get('hashtags', [])
    username = get_jwt_identity()

    # Load social data from JSON file
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

    # Save updated social data back to the JSON file
    with open(social_data_path, "w") as f:
        json.dump(social_data, f, indent=4)

    return jsonify({"message": "Post created successfully"}), 201

# Get posts endpoint
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
