"""
Database models for the Employee Management System.

Two tables:
  - Employee: stores basic employee information
  - Review: stores monthly performance reviews for each employee

Growth Score is NOT stored in the database.
It is calculated dynamically from the Review table.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # One employee can have many reviews
    reviews = db.relationship(
        "Review", backref="employee", cascade="all, delete-orphan", lazy=True
    )

    def calculate_growth_score(self):
        """Average of all submitted ratings. Returns None if no reviews exist."""
        if not self.reviews:
            return None
        total = sum(review.rating for review in self.reviews)
        return round(total / len(self.reviews), 2)

    def to_dict(self):
        growth_score = self.calculate_growth_score()
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "name": self.name,
            "department": self.department,
            "experience": self.experience,
            "reviews_submitted": len(self.reviews),
            "growth_score": growth_score if growth_score is not None else "N/A",
        }


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(
        db.Integer, db.ForeignKey("employees.id"), nullable=False
    )
    month = db.Column(db.String(20), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Only one review allowed per employee per month
    __table_args__ = (
        db.UniqueConstraint("employee_id", "month", name="unique_employee_month"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "employee_id": self.employee_id,
            "month": self.month,
            "rating": self.rating,
        }
