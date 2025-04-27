from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import FoodResource, User
from services.serp_api_integration import search_resources_service
from db import db

food_bp = Blueprint("food", __name__)


@food_bp.route("/food-resources", methods=["GET"])
def get_food_resources():
    """Get food resources from both database and SERP API"""
    # Parse zipcode if provided (for SerpAPI)
    zipcode = request.args.get('zipcode')

    # Source parameter - 'db', 'serp', or 'all' (default)
    source = request.args.get('source', 'all')

    results = []

    # Fetch from database if source is 'db' or 'all'
    if source in ['db', 'all']:
        food_resources = FoodResource.query.all()

        for resource in food_resources:
            resource_data = resource.to_dict()
            resource_data['source'] = 'database'
            results.append(resource_data)

    # Fetch from SERP API if source is 'serp' or 'all' and zipcode provided
    if source in ['serp', 'all'] and zipcode:
        try:
            serp_resources = search_resources_service(
                zipcode=zipcode, resource_type="food"
            )

            for resource in serp_resources:
                resource_data = resource
                resource_data['source'] = 'serp'
                results.append(resource_data)

        except Exception as e:
            if source == 'serp':
                return jsonify({"error": str(e)}), 500

    return jsonify(results), 200


@food_bp.route("/food-resources", methods=["POST"])
@jwt_required()
def create_food_resource():
    """Create a new food resource"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to create food resources"}), 403

    data = request.get_json()

    food_resource = FoodResource(
        name=data.get('name'),
        location=data.get('location'),
        organization_id=data.get(
            'organization_id', current_user.organization_id)
    )

    db.session.add(food_resource)
    db.session.commit()

    return jsonify(food_resource.to_dict()), 201


@food_bp.route("/food-resources/<int:resource_id>", methods=["GET"])
def get_food_resource(resource_id):
    """Get a specific food resource by ID"""
    food_resource = FoodResource.query.get_or_404(resource_id)
    return jsonify(food_resource.to_dict()), 200


@food_bp.route("/food-resources/<int:resource_id>", methods=["PUT"])
@jwt_required()
def update_food_resource(resource_id):
    """Update a food resource's information"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to update food resources"}), 403

    food_resource = FoodResource.query.get_or_404(resource_id)
    data = request.get_json()

    if 'name' in data:
        food_resource.name = data['name']
    if 'location' in data:
        food_resource.location = data['location']

    db.session.commit()

    return jsonify(food_resource.to_dict()), 200


@food_bp.route("/food-resources/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_food_resource(resource_id):
    """Delete a food resource"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete food resources"}), 403

    food_resource = FoodResource.query.get_or_404(resource_id)
    db.session.delete(food_resource)
    db.session.commit()

    return jsonify({"message": "Food resource deleted successfully"}), 200
