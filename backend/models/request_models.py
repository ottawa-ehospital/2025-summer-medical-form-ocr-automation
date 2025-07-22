# backend/models/request_models.py

from pydantic import BaseModel
from typing import List

class ProcessRequest(BaseModel):
    patient_id: str
    output_folder: str
    selected_files: List[str]