import React, { useState } from "react";
import { Upload, FileImage, CheckCircle, FileUp } from "lucide-react";
import Navbar from "../Nav/Navbar";  
import "./UploadScreen.css";

export default function UploadScreen() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="container">

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
              </div>
            </div>
          </div>
        )}

        <button className="btn-submit large-btn">Submit for Review</button>
        <p className="note">
          Your documents will be reviewed by a healthcare professional
        </p>
      </div>

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
