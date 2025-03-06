import React, { useState } from "react";
<<<<<<< HEAD
import { Upload, FileImage, CheckCircle, FileUp, X } from "lucide-react"; 
=======
import { Upload, FileImage, CheckCircle, FileUp } from "lucide-react";
import Navbar from "../Nav/Navbar";  
>>>>>>> AI
import "./UploadScreen.css";

export default function UploadScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
<<<<<<< HEAD
  const [medicine, setMedicine] = useState("");
  const [medicinesList, setMedicinesList] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
=======
>>>>>>> AI

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

<<<<<<< HEAD
  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleMedicineChange = (e) => {
    setMedicine(e.target.value);
  };

  const addMedicine = () => {
    if (medicine.trim() !== "" && !medicinesList.includes(medicine.trim())) {
      setMedicinesList([...medicinesList, medicine.trim()]);
      setMedicine("");
    }
  };

  const removeMedicine = (med) => {
    setMedicinesList(medicinesList.filter((m) => m !== med));
  };

  const handleSubmit = () => {
    const submissionData = {
      medicines: medicinesList,
      file: selectedFile ? selectedFile.name : "No file selected",
    };

    setSubmittedData(submissionData);

    // Reset fields
    setSelectedFile(null);
    setMedicine("");
    setMedicinesList([]);
  };

  return (
    <div className="container">
=======
  return (
    <div className="container">

>>>>>>> AI
      <div className="upload-container">
        <h2 className="upload-title">How to Upload Your Documents</h2>

        <div className="steps">
          <div className="step active">
            <div className="icon-box">
              <FileImage className="icon" />
            </div>
            <span>Select Image</span>
          </div>
          <div className="step">
            <div className="icon-box">
              <CheckCircle className="icon" />
            </div>
            <span>Confirm Quality</span>
          </div>
          <div className="step">
            <div className="icon-box">
              <FileUp className="icon" />
            </div>
            <span>Submit</span>
          </div>
        </div>

        <div className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileInput"
            hidden
          />
          <label htmlFor="fileInput" className="btn-upload">
            <Upload className="icon" /> Upload Your Image
          </label>
          <div className="drop-zone">
            <p>Drag and Drop your files here</p>
            <span>or</span>
            <p>Select files from your device</p>
          </div>
        </div>

        {selectedFile && (
          <div className="upload-status">
            <h3>Upload Status</h3>
            <div className="file-box">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="file-preview"
              />
              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p>{selectedFile.type}</p>
                <p className="file-ready">Ready to Upload</p>
<<<<<<< HEAD
                <button className="btn-remove" onClick={removeFile}>
                  <X className="remove-icon" /> Remove Image
                </button>
=======
>>>>>>> AI
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        <div className="medicine-input">
          <label htmlFor="medicine">Enter the medicines you are taking:</label>
          <div className="medicine-entry">
            <input
              type="text"
              id="medicine"
              className="medicine-field"
              placeholder="E.g., Paracetamol, Ibuprofen"
              value={medicine}
              onChange={handleMedicineChange}
            />
            <button className="btn-add-medicine" onClick={addMedicine}>Add</button>
          </div>
          <div className="medicine-list">
            {medicinesList.map((med, index) => (
              <div key={index} className="medicine-tag">
                {med} <X className="remove-icon" onClick={() => removeMedicine(med)} />
              </div>
            ))}
          </div>
        </div>

        <button className="btn-submit large-btn" onClick={handleSubmit}>
          Submit for Review
        </button>
=======
        <button className="btn-submit large-btn">Submit for Review</button>
>>>>>>> AI
        <p className="note">
          Your documents will be reviewed by a healthcare professional
        </p>
      </div>

<<<<<<< HEAD
      {submittedData && (
        <div className="json-output">
          <h3>Submitted Data:</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}

=======
>>>>>>> AI
      <footer className="footer">
        <div className="subscribe">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>

        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-box"></div>
            <span>PharmacoGenius</span>
          </div>
          <div className="footer-links">
            <a href="#">Pricing</a>
            <a href="#">About us</a>
            <a href="#">Features</a>
            <a href="#">Help Center</a>
            <a href="#">Contact us</a>
            <a href="#">FAQs</a>
            <a href="#">Careers</a>
          </div>
          <button className="btn-language">English</button>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Brand, Inc. • Privacy • Terms • Sitemap</p>
        </div>
      </footer>
    </div>
  );
}
