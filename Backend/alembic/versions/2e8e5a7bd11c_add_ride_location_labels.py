"""add labels for ride pickup and destination

Revision ID: 2e8e5a7bd11c
Revises: 9c7cfdd3b1e4
Create Date: 2026-11-20
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2e8e5a7bd11c"
down_revision: Union[str, Sequence[str], None] = "9c7cfdd3b1e4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Nullable keeps already-created rides valid. New ride requests require
    # labels through the API schema.
    op.add_column("rides", sa.Column("pickup_label", sa.String(length=255), nullable=True))
    op.add_column("rides", sa.Column("dropoff_label", sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column("rides", "dropoff_label")
    op.drop_column("rides", "pickup_label")
