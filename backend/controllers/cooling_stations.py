from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import CoolingStation, User
from services.serp_api_integration import search_resources_service
from db import db

cooling_bp = Blueprint("cooling", __name__)

@cooling_bp.route("/cooling-stations", methods=["GET"])
def get_cooling_stations():
    """Get cooling stations from both database and SERP API with optional filters"""
    zipcode = request.args.get('zipcode')
    source = request.args.get('source', 'all')
    results = []
    # DB results
    if source in ['db', 'all']:
        stations = CoolingStation.query.all()
        for station in stations:
            data = station.to_dict()
            data['source'] = 'database'
            results.append(data)
    # SERP API results
    if source in ['serp', 'all'] and zipcode:
        try:
            serp_resources = search_resources_service(
                zipcode=zipcode, resource_type="cooling")
            for resource in serp_resources:
                resource['source'] = 'serp'
                results.append(resource)
        except Exception as e:
            if source == 'serp':
                return jsonify({"error": str(e)}), 500
    return jsonify(results), 200

@cooling_bp.route("/cooling-stations", methods=["POST"])
@jwt_required()
def create_cooling_station():
    """Create a new cooling station"""
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to create cooling stations"}), 403
    data = request.get_json()
    station = CoolingStation(
        name=data.get('name'),
        location=data.get('location'),
        organization_id=data.get('organization_id', current_user.organization_id),
        title=data.get('title'),
        address=data.get('address'),
        phone=data.get('phone'),
        website=data.get('website'),
        description=data.get('description'),
        place_id=data.get('place_id'),
        rating=data.get('rating'),
        reviews=data.get('reviews'),
        directions=data.get('directions')
    )
    # GPS coords
    if data.get('gps_coordinates'):
        coords = data['gps_coordinates']
        station.latitude = coords.get('latitude')
        station.longitude = coords.get('longitude')
    else:
        station.latitude = data.get('latitude')
        station.longitude = data.get('longitude')
    db.session.add(station)
    db.session.commit()
    return jsonify(station.to_dict()), 201

@cooling_bp.route("/cooling-stations/<int:station_id>", methods=["GET"])
def get_cooling_station(station_id):
    """Get a specific cooling station by ID"""
    station = CoolingStation.query.get_or_404(station_id)
    return jsonify(station.to_dict()), 200

@cooling_bp.route("/cooling-stations/<int:station_id>", methods=["PUT"])
@jwt_required()
def update_cooling_station(station_id):
    """Update a cooling station's information"""
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    if current_user.role not in ('admin', 'volunteer'):
        return jsonify({"message": "Not authorized to update cooling stations"}), 403
    station = CoolingStation.query.get_or_404(station_id)
    data = request.get_json()
    # core fields
    if 'name' in data:
        station.name = data['name']
    if 'location' in data:
        station.location = data['location']
    # SERP fields
    for field in ['title','address','phone','website','description','place_id','rating','reviews','directions']:
        if field in data:
            setattr(station, field, data[field])
    # GPS coords
    if 'gps_coordinates' in data:
        coords = data['gps_coordinates']
        if coords and 'latitude' in coords and 'longitude' in coords:
            station.latitude = coords['latitude']
            station.longitude = coords['longitude']
    else:
        if 'latitude' in data:
            station.latitude = data['latitude']
        if 'longitude' in data:
            station.longitude = data['longitude']
    db.session.commit()
    return jsonify(station.to_dict()), 200

@cooling_bp.route("/cooling-stations/<int:station_id>", methods=["DELETE"])
@jwt_required()
def delete_cooling_station(station_id):
    """Delete a cooling station"""
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete cooling stations"}), 403
    station = CoolingStation.query.get_or_404(station_id)
    db.session.delete(station)
    db.session.commit()
    return jsonify({"message": "Cooling station deleted successfully"}), 200
