from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ScrewCalculation(Base):
    __tablename__ = "screw_calculations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    reference_name = Column(String(255), nullable=True)
    screw_diameter = Column(String(50), nullable=False)
    plates_thickness = Column(JSON, nullable=False, default=list)
    washers_count = Column(Integer, nullable=False, default=0)
    wasa_count = Column(Integer, nullable=False, default=0)
    calculated_length_mm = Column(Float, nullable=False)
    recommended_length_in = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user = relationship("User", backref="screw_calculations")
