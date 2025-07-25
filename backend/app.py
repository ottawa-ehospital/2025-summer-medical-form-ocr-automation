from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List, Optional
from OCR import MedicalOCRInterface

DEFAULT_OUTPUT_FOLDER = "/Users/xiangwenzhao/Desktop/OCR_Output"
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

interface = MedicalOCRInterface()

# Example mock function: replace with DB query if needed
def get_patient_id_by_username(username: str) -> Optional[str]:
    # Here you could query database; for now mock logic:
    mock_user_map = {
        "alice": "1001",
        "bob": "1002"
    }
    return mock_user_map.get(username.lower())  # Return ID if username found

@app.post("/process")
async def process_files(
    patient_id: Optional[str] = Form(None),
    patient_name: Optional[str] = Form(None),
    files: List[UploadFile] = File(...)
):
    # Resolve patient ID from either patient_id or patient_name
    resolved_patient_id = patient_id
    if not resolved_patient_id and patient_name:
        resolved_patient_id = get_patient_id_by_username(patient_name)

    if not resolved_patient_id:
        return {"success": False, "error": "Either Patient ID or Patient Name must be provided"}

    # Use fixed output folder
    output_folder = DEFAULT_OUTPUT_FOLDER
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Save uploaded files
    saved_paths = []
    for file in files:
        save_path = os.path.join(output_folder, file.filename)
        with open(save_path, "wb") as f:
            f.write(await file.read())
        saved_paths.append(save_path)

    # Configure interface
    interface.set_patient_id(resolved_patient_id)
    interface.set_output_folder(output_folder)
    interface.set_selected_files(saved_paths)

    # Process
    result = interface.process_files()
    return result
