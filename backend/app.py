from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List
from OCR import MedicalOCRInterface

# Fixed default output folder
DEFAULT_OUTPUT_FOLDER = "/Users/xiangwenzhao/Desktop/OCR_Output"
app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

interface = MedicalOCRInterface()

@app.post("/process")
async def process_files(
    patient_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    # Ensure default output folder exists
    if not os.path.exists(DEFAULT_OUTPUT_FOLDER):
        os.makedirs(DEFAULT_OUTPUT_FOLDER)

    # Save uploaded files to default output folder
    saved_paths = []
    for file in files:
        save_path = os.path.join(DEFAULT_OUTPUT_FOLDER, file.filename)
        with open(save_path, "wb") as f:
            f.write(await file.read())
        saved_paths.append(save_path)

    # Set interface configs
    interface.set_patient_id(patient_id)
    interface.set_output_folder(DEFAULT_OUTPUT_FOLDER)
    interface.set_selected_files(saved_paths)

    # Run OCR processing
    result = interface.process_files()
    return result