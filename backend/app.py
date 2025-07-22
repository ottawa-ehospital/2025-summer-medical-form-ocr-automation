# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from OCR import MedicalOCRInterface
from models.request_models import ProcessRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


interface = MedicalOCRInterface()


class ProcessRequest(BaseModel):
    patient_id: str
    output_folder: str
    selected_files: List[str]

@app.post("/process")
def process_medical_files(request: ProcessRequest):
    print("✅ Request received:", request)

    interface.set_patient_id(request.patient_id)
    interface.set_output_folder(request.output_folder)
    interface.set_selected_files(request.selected_files)

    result = interface.process_files()
    print("📤 Result:", result)
    return result