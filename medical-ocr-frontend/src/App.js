import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineFileSearch, AiOutlineFolderOpen, AiOutlineUser, AiOutlineCheckCircle, AiOutlineFileExcel, AiOutlineCloseCircle } from 'react-icons/ai';
import { FaPlay } from 'react-icons/fa';

function App() {
  const [patientId, setPatientId] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSelectOutputFolder = async () => {
    const folderPath = await window.electronAPI.openFolder();
    if (folderPath) setOutputFolder(folderPath);
  };

  const handleSelectFiles = async () => {
    const files = await window.electronAPI.openFiles();
    if (files) setSelectedFiles(files);
  };

  const handleProcess = async () => {
    if (!patientId || !outputFolder || selectedFiles.length === 0) {
      alert("❗ Please fill in all required fields.");
      return;
    }

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

        <div style={{ marginBottom: 16 }}>
          <label><AiOutlineUser /> Patient ID:</label><br />
          <input
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            placeholder="e.g. P123"
            style={inputStyle}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label> Files to Process:</label><br />
          <button onClick={handleSelectFiles}>Select Files</button>
          <ul>
            {selectedFiles.map((file, idx) => (
              <li key={idx} style={{ fontSize: '0.9em' }}>{file}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><AiOutlineFolderOpen /> Output Folder:</label><br />
          <button onClick={handleSelectOutputFolder}>Select Folder</button>
          <p style={pathStyle}>{outputFolder || 'No folder selected'}</p>
        </div>



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
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 8,
  marginTop: 4,
  borderRadius: 6,
  border: '1px solid #ccc',
  fontFamily: 'Inter, Segoe UI, sans-serif'
};

const pathStyle = {
  fontSize: '0.85em',
  color: '#555',
  marginTop: 4,
  fontFamily: 'Inter, Segoe UI, sans-serif'
};

export default App;