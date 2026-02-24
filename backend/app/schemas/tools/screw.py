from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ScrewCalculationBase(BaseModel):
    reference_name: Optional[str] = Field(None, description="Name or reference for this calculation")
    screw_diameter: str = Field(..., description="Diameter of the screw (e.g., '5/8')")
    plates_thickness: List[float] = Field(..., description="List of plate thicknesses in mm")
    washers_count: int = Field(0, description="Number of washers")
    wasa_count: int = Field(0, description="Number of WASA washers")
    calculated_length_mm: float = Field(..., description="Calculated total length in mm")
    recommended_length_in: Optional[float] = Field(None, description="Recommended commercial length in inches")


class ScrewCalculationCreate(ScrewCalculationBase):
    pass


class ScrewCalculationUpdate(BaseModel):
    reference_name: Optional[str] = None


class ScrewCalculationResponse(ScrewCalculationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
