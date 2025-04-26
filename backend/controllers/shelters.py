from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Shelter, User
from services.serp_api_integration import search_resources_service
from db import db

shelters_bp = Blueprint("shelters", __name__)

@shelters_bp.route("/shelters", methods=["GET"])
def get_shelters():
    """Get shelters from both database and SERP API with optional filters"""
    # Parse filter parameters
    wheelchair = request.args.get('wheelchair', type=bool)
    visual = request.args.get('visual', type=bool)
    audio = request.args.get('audio', type=bool)

    # Location parameter
    zipcode = request.args.get('zipcode')

    # Source parameter - 'db', 'serp', or 'all' (default)
    source = request.args.get('source', 'all')

    results = []

    # Get shelters from database if source is 'db' or 'all'
    if source in ['db', 'all']:
        # Base query
        query = Shelter.query

        # Apply accessibility filters
        if wheelchair:
            query = query.filter_by(wheelchair_accessible=True)
        if visual:
            query = query.filter_by(visual_accommodations=True)
        if audio:
            query = query.filter_by(audio_accommodations=True)

        # Get all filtered shelters
        shelters = query.all()

        # Format shelter data
        for shelter in shelters:
            shelter_data = shelter.to_dict()
            shelter_data['source'] = 'database'
            results.append(shelter_data)

    # Get shelters from SERP API if source is 'serp' or 'all' and zipcode is provided
    if source in ['serp', 'all'] and zipcode:
        try:
            serp_resources = search_resources_service(
                zipcode=zipcode, resource_type="shelter")

            for resource in serp_resources:
                resource_data = resource
                resource_data['source'] = 'serp'
                results.append(resource_data)

        except Exception as e:
            # If SERP API fails, continue with just database results
            if source == 'serp':
                return jsonify({"error": str(e)}), 500

    return jsonify(results), 200


@shelters_bp.route("/shelters", methods=["POST"])
@jwt_required()
def create_shelter():
    """Create a new shelter"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can create shelters
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to create shelters"}), 403

    data = request.get_json()

    # Create new shelter with accessibility information
    shelter = Shelter(
        name=data.get('name'),
        location=data.get('location'),
        wheelchair_accessible=data.get('wheelchair_accessible', False),
        visual_accommodations=data.get('visual_accommodations', False),
        audio_accommodations=data.get('audio_accommodations', False),
        organization_id=data.get(
            'organization_id', current_user.organization_id)
    )

    db.session.add(shelter)
    db.session.commit()

    return jsonify(shelter.to_dict()), 201


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["GET"])
def get_shelter(shelter_id):
    """Get a specific shelter by ID"""
    shelter = Shelter.query.get_or_404(shelter_id)
    return jsonify(shelter.to_dict()), 200


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["PUT"])
@jwt_required()
def update_shelter(shelter_id):
    """Update a shelter's information"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins and volunteers can update shelters
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to update shelters"}), 403

    shelter = Shelter.query.get_or_404(shelter_id)
    data = request.get_json()

    # Update fields if provided
    if 'name' in data:
        shelter.name = data['name']
    if 'location' in data:
        shelter.location = data['location']
    if 'wheelchair_accessible' in data:
        shelter.wheelchair_accessible = data['wheelchair_accessible']
    if 'visual_accommodations' in data:
        shelter.visual_accommodations = data['visual_accommodations']
    if 'audio_accommodations' in data:
        shelter.audio_accommodations = data['audio_accommodations']

    db.session.commit()

    return jsonify(shelter.to_dict()), 200


@shelters_bp.route("/shelters/<int:shelter_id>", methods=["DELETE"])
@jwt_required()
def delete_shelter(shelter_id):
    """Delete a shelter"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can delete shelters
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete shelters"}), 403

    shelter = Shelter.query.get_or_404(shelter_id)
    db.session.delete(shelter)
    db.session.commit()

    return jsonify({"message": "Shelter deleted successfully"}), 200
