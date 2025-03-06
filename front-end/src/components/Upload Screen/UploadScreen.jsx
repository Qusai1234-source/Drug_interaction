import React, { useState } from "react";
import axios from "axios";
import { Upload, FileImage, CheckCircle, FileUp, X } from "lucide-react";
import Navbar from "../Nav/Navbar";  
import "./UploadScreen.css";

export default function UploadScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [medicine, setMedicine] = useState("");
  const [medicinesList, setMedicinesList] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Remove Selected File
  const removeFile = () => {
    setSelectedFile(null);
    setUploadMessage("");
  };

  // Handle Medicine Input Change
  const handleMedicineChange = (e) => {
    setMedicine(e.target.value);
  };

  // Add Medicine to List
  const addMedicine = () => {
    if (medicine.trim() !== "" && !medicinesList.includes(medicine.trim())) {
      setMedicinesList([...medicinesList, medicine.trim()]);
      setMedicine("");
    }
  };

  // Remove Medicine from List
  const removeMedicine = (med) => {
    setMedicinesList(medicinesList.filter((m) => m !== med));
  };

  // Upload File to Flask
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("File upload failed. Try again.");
    }
  };

  // Submit Medicines List for Prediction
  const handleSubmit = async () => {
    if (medicinesList.length === 0) {
      alert("Please enter at least one medicine.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        medicines: medicinesList,
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="upload-container">
        <h2 className="upload-title">Upload Your Prescription</h2>

        {/* Steps Indicator */}
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

        {/* File Upload Box */}
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

        {/* File Preview & Upload Button */}
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
                <button className="btn-remove" onClick={removeFile}>
                  <X className="remove-icon" /> Remove Image
                </button>
              </div>
            </div>
            <button className="btn-submit" onClick={handleFileUpload}>
              Upload Image
            </button>
            {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
          </div>
        )}

        {/* Medicine Input Section */}
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

        {/* Submit Button */}
        <button className="btn-submit large-btn" onClick={handleSubmit}>
          Submit for Review
        </button>

        <p className="note">
          Your documents will be reviewed by a healthcare professional.
        </p>

        {/* Prediction Output */}
        {prediction && (
          <div className="json-output">
            <h3>Predicted Interactions:</h3>
            <pre>{JSON.stringify(prediction, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Footer Section */}
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
