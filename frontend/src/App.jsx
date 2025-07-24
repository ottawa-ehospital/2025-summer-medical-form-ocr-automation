// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineFileAdd, AiOutlineFolderOpen } from 'react-icons/ai';

export default function App() {
  const [patientId, setPatientId] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => file.path || file.name);
    setSelectedFiles(files);
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/process', {
        patient_id: patientId,
        output_folder: outputFolder,
        selected_files: selectedFiles
      });
      setResult(res.data);
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', backgroundColor: '#f4f4f4'
    }}>
      <div style={{
        width: 400, padding: 20, backgroundColor: '#fff',
        borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
          Medical OCR Web Interface
        </h2>

        <div style={{ marginBottom: 15 }}>
          <label>Patient ID:</label><br />
          <input value={patientId} onChange={e => setPatientId(e.target.value)} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Output Folder Path:</label><br />
          <input value={outputFolder} onChange={e => setOutputFolder(e.target.value)} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Select Files:</label><br />
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <button onClick={handleProcess} disabled={loading} style={{
          width: '100%', padding: '10px', backgroundColor: '#007bff',
          color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer'
        }}>
          {loading ? 'Processing...' : 'Start Processing'}
        </button>

        {result && (
          <div style={{ marginTop: 20 }}>
            <h4>Result:</h4>
            <p>Processed Files: {result.processed_files}</p>
            <p>Total Records: {result.total_records}</p>
          </div>
        )}
      </div>
    </div>
  );
}