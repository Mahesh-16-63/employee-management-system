"""
REST API routes for the Employee Management System.
"""

from flask import Blueprint, request, jsonify
from models import db, Employee, Review

api = Blueprint("api", __name__)

VALID_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


# ---------- Employee Routes ----------

@api.route("/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.order_by(Employee.created_at.desc()).all()
    return jsonify([emp.to_dict() for emp in employees]), 200


@api.route("/employees", methods=["POST"])
def create_employee():
    data = request.get_json() or {}

    employee_id = str(data.get("employee_id", "")).strip()
    name = str(data.get("name", "")).strip()
    department = str(data.get("department", "")).strip()
    experience = data.get("experience")

    # Validation
    if not employee_id or not name or not department:
        return jsonify({"error": "Please fill all fields."}), 400

    if experience is None or str(experience).strip() == "":
        return jsonify({"error": "Please fill all fields."}), 400

    try:
        experience = float(experience)
    except (ValueError, TypeError):
        return jsonify({"error": "Experience must be a number."}), 400

    if experience < 0:
        return jsonify({"error": "Experience cannot be negative."}), 400

    existing = Employee.query.filter_by(employee_id=employee_id).first()
    if existing:
        return jsonify({"error": "Employee ID already exists."}), 400

    new_employee = Employee(
        employee_id=employee_id,
        name=name,
        department=department,
        experience=experience,
    )
    db.session.add(new_employee)
    db.session.commit()

    return jsonify(new_employee.to_dict()), 201


@api.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"error": "Employee not found."}), 404

    db.session.delete(employee)
    db.session.commit()

    return jsonify({"message": "Employee deleted successfully."}), 200


# ---------- Review Routes ----------

@api.route("/reviews", methods=["POST"])
def add_or_update_review():
    data = request.get_json() or {}

    employee_id = data.get("employee_id")
    month = data.get("month")
    rating = data.get("rating")

    if not employee_id or not month:
        return jsonify({"error": "Please fill all fields."}), 400

    if month not in VALID_MONTHS:
        return jsonify({"error": "Invalid month selected."}), 400

    try:
        rating = int(rating)
    except (ValueError, TypeError):
        return jsonify({"error": "Rating must be between 1 and 10."}), 400

    if rating < 1 or rating > 10:
        return jsonify({"error": "Rating must be between 1 and 10."}), 400

    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found."}), 404

    # If a review already exists for this month, update it instead of
    # creating a duplicate (only one review per employee per month).
    existing_review = Review.query.filter_by(
        employee_id=employee_id, month=month
    ).first()

    if existing_review:
        existing_review.rating = rating
        db.session.commit()
        return jsonify(existing_review.to_dict()), 200

    new_review = Review(employee_id=employee_id, month=month, rating=rating)
    db.session.add(new_review)
    db.session.commit()

    return jsonify(new_review.to_dict()), 201


@api.route("/reviews/<int:employee_id>", methods=["GET"])
def get_reviews(employee_id):
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"error": "Employee not found."}), 404

    reviews = Review.query.filter_by(employee_id=employee_id).all()
    return jsonify([review.to_dict() for review in reviews]), 200
