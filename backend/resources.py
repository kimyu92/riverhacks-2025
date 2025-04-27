from flask import Blueprint
from controllers.cooling_stations import cooling_stations_bp
from controllers.food_resources import food_resources_bp
from controllers.hospitals import hospitals_bp
from controllers.safety_reports import safety_reports_bp
from controllers.shelters import shelters_bp
from controllers.users import users_bp
from controllers.chatbot import chatbot_bp
from controllers.organizations import organizations_bp

# Create blueprint for API v1
api_v1_bp = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# Register all controller blueprints under the API v1 blueprint
api_v1_bp.register_blueprint(cooling_stations_bp)
api_v1_bp.register_blueprint(food_resources_bp)
api_v1_bp.register_blueprint(hospitals_bp)
api_v1_bp.register_blueprint(safety_reports_bp)
api_v1_bp.register_blueprint(shelters_bp)
api_v1_bp.register_blueprint(users_bp)
api_v1_bp.register_blueprint(chatbot_bp)
api_v1_bp.register_blueprint(organizations_bp)

# Convenience function to register all blueprints at once
def register_blueprints(app):
    app.register_blueprint(api_v1_bp)
