from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import User
from db import db

users_bp = Blueprint("users", __name__)

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(f"Login data: {data}")
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 200

@users_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # In a token-based authentication system like JWT,
    # the server doesn't actually maintain session state
    # The client should discard the token on their side
    return jsonify({"message": "Logged out successfully"}), 200

@users_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()

    # Check if username already exists
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"message": "Username already exists"}), 400

    # Create new user
    user = User(
        username=data['username'],
        role=data.get('role', 'user'),
        organization_id=data.get('organization_id')
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "user": user.to_dict()}), 201

@users_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@users_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    # Ensure user can only update their own profile unless they're admin
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'admin' and current_user_id != user_id:
        return jsonify({"message": "Not authorized to update this user"}), 403

    user = User.query.get_or_404(user_id)
    data = request.get_json()

    # Only admins can change roles
    if 'role' in data and current_user.role != 'admin':
        return jsonify({"message": "Not authorized to change role"}), 403

    # Update fields
    if 'username' in data:
        # Check if username is already taken by another user
        existing = User.query.filter_by(username=data['username']).first()
        if existing and existing.id != user_id:
            return jsonify({"message": "Username already taken"}), 400
        user.username = data['username']

    if 'password' in data:
        user.set_password(data['password'])

    if 'role' in data and current_user.role == 'admin':
        user.role = data['role']

    if 'organization_id' in data and current_user.role == 'admin':
        user.organization_id = data['organization_id']

    db.session.commit()
    return jsonify({"message": "User updated successfully", "user": user.to_dict()}), 200

@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    # Only admins or the user themselves can delete their account
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'admin' and current_user_id != user_id:
        return jsonify({"message": "Not authorized to delete this user"}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

