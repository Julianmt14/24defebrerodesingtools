
from alembic import op
import sqlalchemy as sa

revision = '9999'
down_revision = '00d2f45ef994'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'screw_calculations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('reference_name', sa.String(length=255), nullable=True),
        sa.Column('screw_diameter', sa.String(length=50), nullable=False),
        sa.Column('plates_thickness', sa.JSON(), nullable=False),
        sa.Column('washers_count', sa.Integer(), nullable=False),
        sa.Column('wasa_count', sa.Integer(), nullable=False),
        sa.Column('calculated_length_mm', sa.Float(), nullable=False),
        sa.Column('recommended_length_in', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_screw_calculations_id'), 'screw_calculations', ['id'], unique=False)
    op.create_index(op.f('ix_screw_calculations_user_id'), 'screw_calculations', ['user_id'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_screw_calculations_user_id'), table_name='screw_calculations')
    op.drop_index(op.f('ix_screw_calculations_id'), table_name='screw_calculations')
    op.drop_table('screw_calculations')
