from db import db
from datetime import datetime

class SafetyReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    report_type = db.Column(db.String(50), nullable=False)  # 'accessibility', 'hazard', 'safety', etc
    status = db.Column(db.String(20), default='pending')  # 'pending', 'verified', 'resolved'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'report_type': self.report_type,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id
        }
