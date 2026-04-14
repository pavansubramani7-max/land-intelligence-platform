"""Initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("admin", "analyst", "viewer", name="userrole"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=True),
        sa.Column("is_verified", sa.Boolean(), nullable=True),
        sa.Column("otp_code", sa.String(6), nullable=True),
        sa.Column("otp_expires_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_id", "users", ["id"], unique=False)

    op.create_table(
        "land_records",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("location", sa.String(255), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("area_sqft", sa.Float(), nullable=False),
        sa.Column("zone_type", sa.Enum("residential", "commercial", "agricultural", "industrial", name="zonetype"), nullable=False),
        sa.Column("road_proximity_km", sa.Float(), nullable=True),
        sa.Column("infrastructure_score", sa.Float(), nullable=True),
        sa.Column("year_established", sa.Integer(), nullable=True),
        sa.Column("soil_type", sa.String(50), nullable=True),
        sa.Column("flood_risk", sa.Boolean(), nullable=True),
        sa.Column("market_price", sa.Float(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "ownership_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("land_id", sa.Integer(), nullable=False),
        sa.Column("owner_name", sa.String(200), nullable=False),
        sa.Column("owner_id_number", sa.String(100), nullable=True),
        sa.Column("transfer_date", sa.Date(), nullable=False),
        sa.Column("transfer_price", sa.Integer(), nullable=True),
        sa.Column("transfer_type", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["land_id"], ["land_records.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "prediction_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("land_id", sa.Integer(), nullable=False),
        sa.Column("model_version", sa.String(50), nullable=False),
        sa.Column("prediction_type", sa.String(50), nullable=False),
        sa.Column("valuation", sa.Float(), nullable=True),
        sa.Column("risk_score", sa.Float(), nullable=True),
        sa.Column("confidence_score", sa.Float(), nullable=True),
        sa.Column("shap_values", sa.JSON(), nullable=True),
        sa.Column("input_features", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["land_id"], ["land_records.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "legal_documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("land_id", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(50), nullable=False),
        sa.Column("ocr_text", sa.Text(), nullable=True),
        sa.Column("integrity_score", sa.Float(), nullable=True),
        sa.Column("extracted_entities", sa.String(), nullable=True),
        sa.Column("uploaded_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["land_id"], ["land_records.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "feedbacks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("prediction_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("user_rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("actual_value", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["prediction_id"], ["prediction_logs.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("feedbacks")
    op.drop_table("legal_documents")
    op.drop_table("prediction_logs")
    op.drop_table("ownership_history")
    op.drop_table("land_records")
    op.drop_table("users")
