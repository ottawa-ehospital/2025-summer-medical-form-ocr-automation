#####Overview####

This project provides an OCR-based automation system for extracting and structuring medical form data.
It supports image/PDF uploads, processes them via an LLM-enhanced OCR pipeline, and outputs structured CSV and Word files ready for database integration.

#####Key features#####
	•	OCR extraction with Gemini 1.5 Flash (Google Generative AI)
	•	Data cleansing and structured output (CSV + DOCX)
	•	Desktop-like web interface built with React
	•	FastAPI backend with CORS support
	•	Fixed output folder for simplified deployment


#####Backend (Python)######
	•	Python 3.10+
	•	FastAPI – Web framework
	•	Uvicorn – ASGI server
	•	Pandas – Data processing
	•	python-docx – Word export
	•	Google Generative AI – Gemini API for OCR
	•	python-multipart – File uploads
	•	pydantic – Data validation

Install via:
pip install fastapi uvicorn pandas python-docx google-generativeai python-multipart pydantic

#####Frontend (React)#####
	•	Node.js 18+
	•	React
	•	Axios – API requests
	•	React Icons – UI icons
	•	React Scripts
 install via：npm install

### Setup Instructions

1. Clone the repository： git clone https://github.com/ottawa-ehospital/2025-summer-medical-form-ocr-automation.git
cd 2025-summer-medical-form-ocr-automation
2. backend set up: cd backend
python3 -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate #for windows

pip install -r requirements.txt # (If no file yet, install manually) # pip install fastapi uvicorn pandas python-docx google-generativeai python-multipart pydantic

run backend: uvicorn app:app --reload

3. frontend set up
cd frontend
npm install
npm start

Note: currently the processed file is saved in/Users/xiangwenzhao/Desktop/OCR_Output/, you may need to update it for integration; The APIkey needs to be updated before running the backend, please update it in /backend/OCR.py where it is highlighted.

####Output####
	•	CSV files: Structured, database-ready data per table.
	•	Word files: Full extracted text for manual review.
