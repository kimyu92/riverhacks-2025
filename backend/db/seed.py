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

    # Create admin
    admin = User(username="admin", role="admin")
    admin.set_password("admin123")

    # Create volunteers
    volunteers_data = [
        ("john.doe", "volunteer", redcross.id),
        ("jane.doe", "volunteer", redcross.id),
        ("john.conner", "volunteer", salvation_army.id),
        ("sarah.conner", "volunteer", salvation_army.id),
        ("vincent.conner", "volunteer", salvation_army.id),
        ("mike.tyson", "volunteer", salvation_army.id),
        ("mackenzie.scott", "volunteer", feeding_america.id),
        ("melinda.gates", "volunteer", feeding_america.id),
        ("leonardo.diCaprio", "volunteer", habitat.id),
    ]

    volunteers = []
    for username, role, organization_id in volunteers_data:
        volunteer = User(username=username, role=role, organization_id=organization_id)
        volunteer.set_password("password")
        volunteers.append(volunteer)

    # Create regular users
    user1 = User(username="steve.job", role="user")
    user1.set_password("password")

    user2 = User(username="alice.job", role="user")
    user2.set_password("password")

    db.session.add_all([
        admin,
        *volunteers,
        user1,
        user2,
    ])
    db.session.commit()
    print("Added users")

    # Create shelters with enhanced data to match SERP API format
    shelters = [
        Shelter(
            name="Downtown Emergency Shelter",
            address="123 Main St, City Center",
            title="Downtown Emergency Shelter",
            wheelchair_accessible=True,
            visual_accommodations=True,
            audio_accommodations=False,
            organization_id=redcross.id,
            phone="555-123-4567",
            website="https://downtownshelter.org",
            description="Emergency shelter providing beds and basic services",
            rating=4.5,
            reviews=78,
            latitude=30.2672,
            longitude=-97.7431
        ),
        Shelter(
            name="Westside Family Shelter",
            address="456 West Ave, Westside",
            title="Westside Family Shelter",
            wheelchair_accessible=True,
            visual_accommodations=False,
            audio_accommodations=True,
            organization_id=salvation_army.id,
            phone="555-234-5678",
            website="https://westsideshelter.org",
            description="Family-oriented shelter with support services",
            rating=4.2,
            reviews=45,
            latitude=30.2750,
            longitude=-97.7566
        ),
        Shelter(
            name="Eastside Temporary Housing",
            address="789 East Blvd, Eastside",
            title="Eastside Temporary Housing",
            wheelchair_accessible=False,
            visual_accommodations=True,
            audio_accommodations=True,
            organization_id=habitat.id,
            phone="555-345-6789",
            website="https://eastsidehousing.org",
            description="Temporary housing solutions for those in transition",
            rating=4.0,
            reviews=32,
            latitude=30.2550,
            longitude=-97.7266
        ),
        Shelter(
            name="Austin Resource Center for the Homeless",
            address="500 E 7th St, Austin, TX 78701",
            title="Austin Resource Center for the Homeless (ARCH)",
            organization_id=redcross.id,
            phone="(512) 881-8951",
            website="https://communitycaretx.org/all-locations/austin-resource-center-for-the-homeless-clinic/",
            description="They help feed families by sending the food to schools in and around austin.",
            place_id="ChIJPXBW86a1RIYRLHKKgjK4Nf0",
            rating=3.5,
            reviews=243,
            wheelchair_accessible=True,
            visual_accommodations=False,
            audio_accommodations=True,
            latitude=30.2677651,
            longitude=-97.73759749999999
        ),
        Shelter(
            name="Casa Marianella",
            address="821 Gunter St, Austin, TX 78702",
            title="Casa Marianella",
            organization_id=salvation_army.id,
            phone="(512) 385-5571",
            website="https://www.casamarianella.org/",
            description="The great place for immigrants to live great shelter",
            place_id="ChIJsdFZNNS1RIYRbVRMVJwnaGc",
            rating=4.6,
            reviews=213,
            wheelchair_accessible=True,
            visual_accommodations=True,
            audio_accommodations=True,
            latitude=30.2598715,
            longitude=-97.7010093
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

    # Create food resources with enhanced data to match SERP API format
    food_resources = [
        FoodResource(
            name="Downtown Food Bank",
            title="Downtown Food Bank",
            location="150 Center St, City Center",
            address="150 Center St, City Center",
            organization_id=feeding_america.id,
            phone="555-111-2222",
            website="https://downtownfoodbank.org",
            description="Provides emergency food assistance to those in need",
            rating=4.8,
            reviews=125,
            latitude=30.2650,
            longitude=-97.7466
        ),
        FoodResource(
            name="Westside Community Kitchen",
            title="Westside Community Kitchen",
            location="250 West St, Westside",
            address="250 West St, Westside",
            organization_id=salvation_army.id,
            phone="555-222-3333",
            website="https://westsidekitchen.org",
            description="Hot meals served daily from 11am-2pm",
            rating=4.6,
            reviews=89,
            latitude=30.2750,
            longitude=-97.7566
        ),
        FoodResource(
            name="Eastside Food Pantry",
            title="Eastside Food Pantry",
            location="350 East Ave, Eastside",
            address="350 East Ave, Eastside",
            organization_id=redcross.id,
            phone="555-333-4444",
            website="https://eastsidepantry.org",
            description="Distributes groceries every Tuesday and Thursday",
            rating=4.7,
            reviews=102,
            latitude=30.2550,
            longitude=-97.7266
        ),
        FoodResource(
            name="Central Texas Food Bank",
            title="Central Texas Food Bank",
            location="6500 Metropolis Dr, Austin, TX 78744",
            address="6500 Metropolis Dr, Austin, TX 78744",
            organization_id=feeding_america.id,
            phone="(512) 282-2111",
            website="https://www.centraltexasfoodbank.org/",
            description="Main food bank serving Central Texas region",
            place_id="ChIJjVMQpzSzRIYRtKZqhy25smo",
            rating=4.7,
            reviews=451,
            latitude=30.203436,
            longitude=-97.7102731
        ),
        FoodResource(
            name="Hungry Souls",
            title="Hungry Souls",
            location="7100 Brodie Ln, Austin, TX 78745",
            address="7100 Brodie Ln, Austin, TX 78745",
            organization_id=None,
            phone="(512) 524-9067",
            website="https://hungry-souls.org/",
            description="They help feed families by sending the food to schools in and around austin.",
            place_id="ChIJBdd0mThJW4YR1VPtgIBirA4",
            rating=4.9,
            reviews=11,
            latitude=30.212557,
            longitude=-97.8322525
        )
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
