from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from OCR import MedicalOCRInterface
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

interface = MedicalOCRInterface()

@app.post("/process")
async def process_files(
    patient_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    saved_files = []
    os.makedirs("uploads", exist_ok=True)


    for file in files:
        path = f"uploads/{file.filename}"
        with open(path, "wb") as f:
            f.write(await file.read())
        saved_files.append(path)

    
    interface.set_patient_id(patient_id)
    interface.set_selected_files(saved_files)
    interface.set_output_folder("outputs")
    os.makedirs("outputs", exist_ok=True)

    result = interface.process_files()

    return {
        "message": "Processing complete",
        "result": result
    }