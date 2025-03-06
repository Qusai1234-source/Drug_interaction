<<<<<<< HEAD
import React, { useState } from "react";
import { Download, Printer, Share2, CheckCircle, AlertCircle, MessageCircle, X } from "lucide-react";
import "./AnalysisResults.css";

export default function AnalysisResults() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="container">
      
=======
import React from "react";
import { Download, Printer, Share2, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "../Nav/Navbar";  // Importing Navbar
import "./AnalysisResults.css";

export default function AnalysisResults() {
  return (
    <div className="container">

      {/* Main Content */}
>>>>>>> AI
      <div className="content">
        <div className="header">
          <h1>Analysis Results</h1>
          <div className="actions">
            <button className="action-btn"><Download className="icon" />Download</button>
            <button className="action-btn"><Printer className="icon" />Print</button>
            <button className="action-btn"><Share2 className="icon" />Share</button>
          </div>
        </div>

<<<<<<< HEAD
        
=======
        {/* Patient Information */}
>>>>>>> AI
        <div className="card">
          <h2>Patient Information</h2>
          <div className="info-grid">
            <div>
              <p className="label">Patient Name</p>
              <p className="value">John Doe</p>
            </div>
            <div>
              <p className="label">Date of Birth</p>
              <p className="value">01/15/1980</p>
            </div>
            <div>
              <p className="label">Patient ID</p>
              <p className="value">P12345678</p>
            </div>
            <div>
              <p className="label">Referring Physician</p>
              <p className="value">Dr. Sarah Johnson</p>
            </div>
            <div>
              <p className="label">Analysis Date</p>
              <p className="value">06/15/2023</p>
            </div>
            <div>
              <p className="label">Report ID</p>
              <p className="value">R98765432</p>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        
=======
        {/* Medication Analysis */}
>>>>>>> AI
        <div className="card">
          <h2>Medication Analysis</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lisinopril</td>
                <td>10mg</td>
                <td>Once daily</td>
                <td className="status safe"><CheckCircle className="icon-small" />Safe</td>
              </tr>
              <tr>
                <td>Atorvastatin</td>
                <td>20mg</td>
                <td>Once daily</td>
                <td className="status caution"><AlertCircle className="icon-small" />Caution</td>
              </tr>
              <tr>
                <td>Metformin</td>
                <td>500mg</td>
                <td>Twice daily</td>
                <td className="status safe"><CheckCircle className="icon-small" />Safe</td>
              </tr>
              <tr>
                <td>Aspirin</td>
                <td>81mg</td>
                <td>Once daily</td>
                <td className="status interaction"><AlertCircle className="icon-small" />Interaction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< HEAD

      
      <button className="chatbot-btn" onClick={() => setShowChatbot(!showChatbot)}>
        <MessageCircle className="chat-icon" />
      </button>

      
      {showChatbot && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>AI Chatbot</h3>
            <button onClick={() => setShowChatbot(false)} className="close-btn">
              <X />
            </button>
          </div>
          <div className="chatbot-body">
            <p>Hello! How can I assist you today?</p>
          </div>
        </div>
      )}
=======
>>>>>>> AI
    </div>
  );
}
