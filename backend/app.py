"""
Entry point for the Employee Management System backend.

Run with:  python app.py
"""

from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from routes import api


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Allow requests from the React frontend
    db.init_app(app)

    app.register_blueprint(api)

    with app.app_context():
        db.create_all()  # Creates tables if they do not already exist

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
