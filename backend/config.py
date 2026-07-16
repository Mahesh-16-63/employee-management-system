"""
Configuration settings for the Flask application.

Supports three database modes via the DB_MODE environment variable:

  DB_MODE=sqlite_local   (default) - local SQLite file, no setup needed,
                          used for local development. Does NOT persist on
                          serverless platforms like Vercel.
  DB_MODE=turso          - hosted, persistent SQLite-compatible database
                          (Turso). Requires TURSO_DATABASE_URL and
                          TURSO_AUTH_TOKEN env vars. Works correctly on
                          Vercel because it's a real remote server, not a
                          local file.
  DB_MODE=mysql          - traditional MySQL server. Requires DB_USERNAME,
                          DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME env vars.

No other code changes are needed when switching modes - SQLAlchemy
abstracts the rest.
"""

import os

DB_MODE = os.environ.get("DB_MODE", "sqlite_local")

# --- Turso settings (used only when DB_MODE=turso) ---
TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL", "")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN", "")

# --- MySQL settings (used only when DB_MODE=mysql) ---
DB_USERNAME = os.environ.get("DB_USERNAME", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "your_password")
DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "employee_management")


class Config:
    if DB_MODE == "turso":
        # TURSO_DATABASE_URL looks like "libsql://your-db-name.turso.io"
        SQLALCHEMY_DATABASE_URI = f"sqlite+{TURSO_DATABASE_URL}?secure=true"
        SQLALCHEMY_ENGINE_OPTIONS = {
            "connect_args": {"auth_token": TURSO_AUTH_TOKEN},
        }
    elif DB_MODE == "mysql":
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )
    else:
        # Local file, stored under backend/instance/ - created automatically.
        SQLALCHEMY_DATABASE_URI = "sqlite:///employee_management.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
