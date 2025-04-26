import os
from flask import Flask
from datetime import datetime
import sys
from pathlib import Path

# Add the parent directory to the Python path to import modules correctly
sys.path.append(str(Path(__file__).parent.parent))

from db import db
from models.user import User
from models.organization import Organization
from models.shelter import Shelter
from models.hospital import Hospital
from models.food_resource import FoodResource
from models.safety_report import SafetyReport

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://hackuser:hackpass@db:5432/hacksafety')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

def seed_database():
    print("Starting database seeding...")

    # Clear existing data
    db.session.query(SafetyReport).delete()
    db.session.query(FoodResource).delete()
    db.session.query(Hospital).delete()
    db.session.query(Shelter).delete()
    db.session.query(User).delete()
    db.session.query(Organization).delete()
    db.session.commit()

    print("Cleared existing data. Adding new seed data...")

    # Create organizations
    redcross = Organization(name="Red Cross")
    salvation_army = Organization(name="Salvation Army")
    feeding_america = Organization(name="Feeding America")
    habitat = Organization(name="Habitat for Humanity")

    db.session.add_all([redcross, salvation_army, feeding_america, habitat])
    db.session.commit()
    print("Added organizations")

    # Create users
    admin = User(username="admin", role="admin")
    admin.set_password("admin123")

    volunteer1 = User(username="volunteer1", role="volunteer", organization_id=redcross.id)
    volunteer1.set_password("password")

    volunteer2 = User(username="volunteer2", role="volunteer", organization_id=salvation_army.id)
    volunteer2.set_password("password")

    user1 = User(username="user1", role="user")
    user1.set_password("password")

    user2 = User(username="user2", role="user")
    user2.set_password("password")

    db.session.add_all([admin, volunteer1, volunteer2, user1, user2])
    db.session.commit()
    print("Added users")

    # Create shelters
    shelters = [
        Shelter(
            name="Downtown Emergency Shelter",
            location="123 Main St, City Center",
            wheelchair_accessible=True,
            visual_accommodations=True,
            audio_accommodations=False,
            organization_id=redcross.id
        ),
        Shelter(
            name="Westside Family Shelter",
            location="456 West Ave, Westside",
            wheelchair_accessible=True,
            visual_accommodations=False,
            audio_accommodations=True,
            organization_id=salvation_army.id
        ),
        Shelter(
            name="Eastside Temporary Housing",
            location="789 East Blvd, Eastside",
            wheelchair_accessible=False,
            visual_accommodations=True,
            audio_accommodations=True,
            organization_id=habitat.id
        ),
    ]
    db.session.add_all(shelters)
    db.session.commit()
    print("Added shelters")

    # Create hospitals
    hospitals = [
        Hospital(
            name="City General Hospital",
            location="100 Healthcare Dr, City Center",
            wheelchair_accessible=True,
            has_emergency_room=True,
            accepts_uninsured=True,
            phone_number="555-123-4567"
        ),
        Hospital(
            name="Westside Medical Center",
            location="200 Medical Pkwy, Westside",
            wheelchair_accessible=True,
            has_emergency_room=True,
            accepts_uninsured=False,
            phone_number="555-234-5678"
        ),
        Hospital(
            name="Eastside Community Clinic",
            location="300 Health St, Eastside",
            wheelchair_accessible=True,
            has_emergency_room=False,
            accepts_uninsured=True,
            phone_number="555-345-6789"
        ),
    ]
    db.session.add_all(hospitals)
    db.session.commit()
    print("Added hospitals")

    # Create food resources
    food_resources = [
        FoodResource(
            name="Downtown Food Bank",
            location="150 Center St, City Center",
            organization_id=feeding_america.id
        ),
        FoodResource(
            name="Westside Community Kitchen",
            location="250 West St, Westside",
            organization_id=salvation_army.id
        ),
        FoodResource(
            name="Eastside Food Pantry",
            location="350 East Ave, Eastside",
            organization_id=redcross.id
        ),
    ]
    db.session.add_all(food_resources)
    db.session.commit()
    print("Added food resources")

    # Create safety reports
    safety_reports = [
        SafetyReport(
            title="Broken Wheelchair Ramp",
            description="The wheelchair ramp at 123 Main St is damaged and unsafe to use.",
            location="123 Main St, City Center",
            report_type="accessibility",
            status="pending",
            created_at=datetime.utcnow(),
            user_id=user1.id
        ),
        SafetyReport(
            title="Street Lights Out",
            description="Multiple street lights are out on West Ave between 4th and 6th St, creating an unsafe environment at night.",
            location="West Ave between 4th and 6th St",
            report_type="safety",
            status="verified",
            created_at=datetime.utcnow(),
            user_id=user2.id
        ),
        SafetyReport(
            title="Flooded Underpass",
            description="The underpass at East Blvd is flooded and impassable.",
            location="East Blvd Underpass",
            report_type="hazard",
            status="resolved",
            created_at=datetime.utcnow(),
            user_id=user1.id
        ),
    ]
    db.session.add_all(safety_reports)
    db.session.commit()
    print("Added safety reports")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_database()
