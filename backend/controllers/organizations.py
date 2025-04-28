from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import User, Organization
from db import db

organizations_bp = Blueprint("organizations", __name__)

# @jwt_required()
@organizations_bp.route("/organizations", methods=["GET"])
def get_all_organizations():
    # Get current user to check role
    try:
        current_user_id = 1 # get_jwt_identity()
        print(f"JWT Identity: {current_user_id}")

        current_user = User.query.get(current_user_id)

        if not current_user:
            print(f"Error: User with id {current_user_id} not found in database")
            return jsonify({"message": "User not found"}), 404

        print(f"Current user: {current_user.username}, Role: {current_user.role}")

        # Only admin can view all organizations
        if current_user.role != 'admin':
            print(f"Authorization failed: {current_user.username} with role {current_user.role} attempted to access organizations")
            return jsonify({"message": "Not authorized to view all organizations"}), 403

        organizations = Organization.query.all()
        return jsonify([org.to_dict() for org in organizations]), 200
    except Exception as e:
        print(f"Error in get_all_organizations: {str(e)}")
        return jsonify({"message": "An error occurred processing this request", "error": str(e)}), 500

@organizations_bp.route("/organizations/<int:org_id>", methods=["GET"])
# @jwt_required()
def get_organization(org_id):
    # Get current user to check role
    current_user_id = 1 # get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admin can view organization details
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to view organization details"}), 403

    organization = Organization.query.get_or_404(org_id)

    # Get organization details with volunteers
    org_data = organization.to_dict()
    volunteers = User.query.filter_by(organization_id=org_id).all()
    org_data['volunteers'] = [volunteer.to_dict() for volunteer in volunteers]

    return jsonify(org_data), 200

@organizations_bp.route("/organizations", methods=["POST"])
@jwt_required()
def create_organization():
    # Get current user to check role
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admin can create organizations
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to create organizations"}), 403

    data = request.get_json()

    # Validate input
    if not data.get('name'):
        return jsonify({"message": "Organization name is required"}), 400

    # Check if organization with same name already exists
    if Organization.query.filter_by(name=data['name']).first():
        return jsonify({"message": "Organization with this name already exists"}), 400

    # Create new organization
    organization = Organization(name=data['name'])

    db.session.add(organization)
    db.session.commit()

    return jsonify({"message": "Organization created successfully", "organization": organization.to_dict()}), 201

@organizations_bp.route("/organizations/<int:org_id>", methods=["PUT"])
@jwt_required()
def update_organization(org_id):
    # Get current user to check role
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admin can update organizations
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to update organizations"}), 403

    organization = Organization.query.get_or_404(org_id)
    data = request.get_json()

    # Update organization name if provided
    if 'name' in data:
        # Check if name is already taken
        existing = Organization.query.filter_by(name=data['name']).first()
        if existing and existing.id != org_id:
            return jsonify({"message": "Organization with this name already exists"}), 400

        organization.name = data['name']

    db.session.commit()

    return jsonify({"message": "Organization updated successfully", "organization": organization.to_dict()}), 200

@organizations_bp.route("/organizations/<int:org_id>", methods=["DELETE"])
@jwt_required()
def delete_organization(org_id):
    # Get current user to check role
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admin can delete organizations
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete organizations"}), 403

    organization = Organization.query.get_or_404(org_id)

    # Check if organization has volunteers
    if len(organization.volunteers) > 0:
        return jsonify({"message": "Cannot delete organization with assigned volunteers"}), 400

    # Check if organization has shelters
    if len(organization.shelters) > 0:
        return jsonify({"message": "Cannot delete organization with assigned shelters"}), 400

    # Check if organization has food resources
    if len(organization.foods) > 0:
        return jsonify({"message": "Cannot delete organization with assigned food resources"}), 400

    db.session.delete(organization)
    db.session.commit()

    return jsonify({"message": "Organization deleted successfully"}), 200
