import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineFileSearch, AiOutlineUser, AiOutlineCheckCircle, AiOutlineFileExcel, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';

function App() {
  const [identifier, setIdentifier] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection (upload)
  const handleFileSelect = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleProcess = async () => {
    if (!identifier || selectedFiles.length === 0) {
      alert("Please provide Patient ID or Name and select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append('patient_id', identifier);
    formData.append('patient_name', identifier);
    for (let file of selectedFiles) {
      formData.append('files', file);
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        fontFamily: 'Inter, Segoe UI, sans-serif',
        padding: 30,
        maxWidth: 700,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <AiOutlineFileSearch /> Medical Document Processing System
        </h2>

        {/* Identifier input */}
        <div style={{ marginBottom: 16 }}>
          <label><AiOutlineUser /> Patient ID or Name (enter at least one):</label><br />
          <input
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="e.g. P123 or JohnDoe"
            style={inputStyle}
          />
        </div>

        {/* File upload */}
        <div style={{ marginBottom: 16 }}>
          <label>Files to Process:</label><br />
          <input type="file" multiple onChange={handleFileSelect} />
          <ul>
            {Array.from(selectedFiles).map((file, idx) => (
              <li key={idx} style={{ fontSize: '0.9em' }}>{file.name}</li>
            ))}
          </ul>
        </div>

        {/* Process button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleProcess}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {loading ? 'Processing...' : <><FaPlay /> Start Processing</>}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{ marginTop: 30, padding: 20, backgroundColor: '#f1f1f1', borderRadius: 8 }}>
            <h4><AiOutlineCheckCircle /> Processing Result</h4>
            <p><AiOutlineFileSearch /> Files Processed: {result.processed_files}</p>
            <p><AiOutlineCheckCircle /> Records Created: {result.total_records}</p>
            <p><AiOutlineFileExcel /> CSV Files: {result.csv_files_created?.join(', ') || 'None'}</p>
            {result.files_failed?.length > 0 && (
              <>
                <p><AiOutlineCloseCircle /> Failed Files:</p>
                <ul>
                  {result.files_failed.map((f, i) => (
                    <li key={i}>{f.filename} - {f.error}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
