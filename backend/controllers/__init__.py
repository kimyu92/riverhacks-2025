from flask import Blueprint
from controllers.users import users_bp

def register_blueprints(app):
    """Register all blueprint modules in the application."""

    # Import and register all blueprint controllers
    from controllers.shelters import shelters_bp
    from controllers.food_resources import food_bp
    from controllers.safety_reports import reports_bp
    from controllers.hospitals import hospitals_bp
    from controllers.chatbot import chatbot_bp
    from controllers.cooling_stations import cooling_bp

    # Register all blueprints
    app.register_blueprint(users_bp, url_prefix='/api/v1')
    app.register_blueprint(shelters_bp, url_prefix='/api/v1')
    app.register_blueprint(food_bp, url_prefix='/api/v1')
    app.register_blueprint(reports_bp, url_prefix='/api/v1')
    app.register_blueprint(hospitals_bp, url_prefix='/api/v1')
    app.register_blueprint(chatbot_bp, url_prefix='/api/v1')
    app.register_blueprint(cooling_bp, url_prefix='/api/v1')
