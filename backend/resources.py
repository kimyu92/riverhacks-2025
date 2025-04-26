from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Organization, Shelter, FoodResource
from app import db

# Helpers
def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)

class UserRegister(Resource):
    def post(self):
        data = request.get_json()
        if User.query.filter_by(username=data.get('username')).first():
            return {'message': 'Username already exists'}, 400
        user = User(username=data['username'])
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return {'message': 'User created'}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if not user or not user.check_password(data.get('password')):
            return {'message': 'Invalid credentials'}, 401
        access_token = create_access_token(identity=user.id)
        return {'access_token': access_token}, 200

class OrganizationResource(Resource):
    @jwt_required()
    def get(self):
        orgs = Organization.query.all()
        return [o.to_dict() for o in orgs], 200

    @jwt_required()
    def post(self):
        current = get_current_user()
        if current.role != 'admin':
            return {'message': 'Admins only'}, 403
        data = request.get_json()
        org = Organization(name=data.get('name'))
        db.session.add(org)
        db.session.commit()
        return org.to_dict(), 201

class VolunteerResource(Resource):
    @jwt_required()
    def post(self):
        current = get_current_user()
        if current.role != 'admin':
            return {'message': 'Admins only'}, 403
        data = request.get_json()
        org = Organization.query.get(data.get('organization_id'))
        if not org:
            return {'message': 'Organization not found'}, 404
        user = User(username=data['username'], role='volunteer', organization_id=org.id)
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201

class ShelterList(Resource):
    def get(self):
        shelters = Shelter.query.all()
        return [s.to_dict() for s in shelters], 200

    @jwt_required()
    def post(self):
        current = get_current_user()
        if current.role not in ('admin', 'volunteer'):
            return {'message': 'Forbidden'}, 403
        data = request.get_json()
        org_id = data.get('organization_id', current.organization_id)
        shelter = Shelter(
            name=data.get('name'),
            location=data.get('location'),
            wheelchair_accessible=data.get('wheelchair_accessible', False),
            visual_accommodations=data.get('visual_accommodations', False),
            audio_accommodations=data.get('audio_accommodations', False),
            organization_id=org_id
        )
        db.session.add(shelter)
        db.session.commit()
        return shelter.to_dict(), 201

class ShelterResource(Resource):
    def get(self, id):
        shelter = Shelter.query.get_or_404(id)
        return shelter.to_dict(), 200

    @jwt_required()
    def put(self, id):
        current = get_current_user()
        if current.role not in ('admin', 'volunteer'):
            return {'message': 'Forbidden'}, 403
        shelter = Shelter.query.get_or_404(id)
        data = request.get_json()
        for field in ['name', 'location', 'wheelchair_accessible', 'visual_accommodations', 'audio_accommodations']:
            if field in data:
                setattr(shelter, field, data[field])
        db.session.commit()
        return shelter.to_dict(), 200

    @jwt_required()
    def delete(self, id):
        current = get_current_user()
        if current.role != 'admin':
            return {'message': 'Admins only'}, 403
        shelter = Shelter.query.get_or_404(id)
        db.session.delete(shelter)
        db.session.commit()
        return {'message': 'Deleted'}, 200

class FoodResourceList(Resource):
    def get(self):
        foods = FoodResource.query.all()
        return [f.to_dict() for f in foods], 200

    @jwt_required()
    def post(self):
        current = get_current_user()
        if current.role not in ('admin', 'volunteer'):
            return {'message': 'Forbidden'}, 403
        data = request.get_json()
        org_id = data.get('organization_id', current.organization_id)
        food = FoodResource(name=data.get('name'), location=data.get('location'), organization_id=org_id)
        db.session.add(food)
        db.session.commit()
        return food.to_dict(), 201

class FoodResourceResource(Resource):
    def get(self, id):
        food = FoodResource.query.get_or_404(id)
        return food.to_dict(), 200

    @jwt_required()
    def put(self, id):
        current = get_current_user()
        if current.role not in ('admin', 'volunteer'):
            return {'message': 'Forbidden'}, 403
        food = FoodResource.query.get_or_404(id)
        data = request.get_json()
        for field in ['name', 'location']:
            if field in data:
                setattr(food, field, data[field])
        db.session.commit()
        return food.to_dict(), 200

    @jwt_required()
    def delete(self, id):
        current = get_current_user()
        if current.role != 'admin':
            return {'message': 'Admins only'}, 403
        food = FoodResource.query.get_or_404(id)
        db.session.delete(food)
        db.session.commit()
        return {'message': 'Deleted'}, 200
