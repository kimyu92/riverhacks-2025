from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import SafetyReport, User
from db import db
import math
from datetime import datetime

reports_bp = Blueprint("reports", __name__)

# Helper for calculating distance between two geocoordinates
def calculate_distance(lat1, lon1, lat2, lon2):
    # Earth radius in kilometers
    R = 6371.0

    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Difference in coordinates
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

@reports_bp.route("/safety-reports", methods=["GET"])
def get_reports():
    """Get all safety reports with optional filters"""
    # Parse filter parameters
    report_type = request.args.get('type')
    status = request.args.get('status')
    days = request.args.get('days', type=int)

    # Get user location for distance sorting
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    # Base query
    query = SafetyReport.query

    # Apply filters
    if report_type:
        query = query.filter_by(report_type=report_type)
    if status:
        query = query.filter_by(status=status)
    if days:
        since_date = datetime.utcnow() - datetime.timedelta(days=days)
        query = query.filter(SafetyReport.created_at >= since_date)

    # Get all filtered reports
    reports = query.all()

    # Calculate distances if location provided
    results = []
    for report in reports:
        report_data = report.to_dict()

        # Parse report location (assuming format "lat,lon" in the location field)
        try:
            report_lat, report_lon = map(float, report.location.split(','))
            if lat and lon:
                distance = calculate_distance(lat, lon, report_lat, report_lon)
                report_data['distance'] = round(distance, 2)
                report_data['lat'] = report_lat
                report_data['lon'] = report_lon
        except:
            report_data['distance'] = None

        results.append(report_data)

    # Sort by distance if location provided
    if lat and lon:
        results = sorted(results, key=lambda x: x.get('distance', float('inf')))
    else:
        # Otherwise sort by created_at (newest first)
        results = sorted(results, key=lambda x: x['created_at'], reverse=True)

    return jsonify(results), 200

@reports_bp.route("/safety-reports", methods=["POST"])
@jwt_required(optional=True)
def create_report():
    """Create a new safety report (authentication optional)"""
    data = request.get_json()

    # Get user ID if authenticated
    user_id = None
    jwt_identity = get_jwt_identity()
    if jwt_identity:
        user_id = jwt_identity

    # Create new safety report
    report = SafetyReport(
        title=data.get('title'),
        description=data.get('description'),
        location=data.get('location'),
        report_type=data.get('report_type', 'safety'),
        user_id=user_id
    )

    db.session.add(report)
    db.session.commit()

    return jsonify(report.to_dict()), 201

@reports_bp.route("/safety-reports/<int:report_id>", methods=["GET"])
def get_report(report_id):
    """Get a specific safety report by ID"""
    report = SafetyReport.query.get_or_404(report_id)
    return jsonify(report.to_dict()), 200

@reports_bp.route("/safety-reports/<int:report_id>", methods=["PUT"])
@jwt_required()
def update_report(report_id):
    """Update a safety report's information (admin or original reporter only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    report = SafetyReport.query.get_or_404(report_id)

    # Only admins or the original reporter can update reports
    if current_user.role != 'admin' and report.user_id != current_user_id:
        return jsonify({"message": "Not authorized to update this report"}), 403

    data = request.get_json()

    # Update fields if provided
    if 'title' in data:
        report.title = data['title']
    if 'description' in data:
        report.description = data['description']
    if 'location' in data:
        report.location = data['location']
    if 'report_type' in data:
        report.report_type = data['report_type']

    # Only admins can update status
    if 'status' in data and current_user.role == 'admin':
        report.status = data['status']

    db.session.commit()

    return jsonify(report.to_dict()), 200

@reports_bp.route("/safety-reports/<int:report_id>", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    """Delete a safety report (admin only)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only admins can delete reports
    if current_user.role != 'admin':
        return jsonify({"message": "Not authorized to delete reports"}), 403

    report = SafetyReport.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()

    return jsonify({"message": "Report deleted successfully"}), 200
