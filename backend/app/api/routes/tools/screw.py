from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db_session
from app.models.screw import ScrewCalculation
from app.models.user import User
from app.schemas.tools.screw import ScrewCalculationCreate, ScrewCalculationResponse

router = APIRouter()


@router.post("/", response_model=ScrewCalculationResponse, status_code=status.HTTP_201_CREATED)
def create_calculation(
    *,
    db: Session = Depends(get_db_session),
    calculation_in: ScrewCalculationCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create new screw calculation.
    """
    calculation = ScrewCalculation(
        **calculation_in.model_dump(),
        user_id=current_user.id
    )
    db.add(calculation)
    db.commit()
    db.refresh(calculation)
    return calculation


@router.get("/", response_model=List[ScrewCalculationResponse])
def read_calculations(
    db: Session = Depends(get_db_session),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve screw calculations for current user.
    """
    calculations = (
        db.query(ScrewCalculation)
        .filter(ScrewCalculation.user_id == current_user.id)
        .order_by(ScrewCalculation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return calculations


@router.delete("/{calculation_id}", response_model=ScrewCalculationResponse)
def delete_calculation(
    *,
    db: Session = Depends(get_db_session),
    calculation_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete a screw calculation by ID.
    """
    calculation = (
        db.query(ScrewCalculation)
        .filter(ScrewCalculation.id == calculation_id, ScrewCalculation.user_id == current_user.id)
        .first()
    )
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
        
    db.delete(calculation)
    db.commit()
    return calculation
