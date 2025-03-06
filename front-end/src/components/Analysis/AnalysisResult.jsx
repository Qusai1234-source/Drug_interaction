import React, { useState } from "react";
import axios from "axios";
import { Download, Printer, Share2, CheckCircle, AlertCircle, MessageCircle, X } from "lucide-react";
import Navbar from "../Nav/Navbar";
import "./AnalysisResults.css";

export default function AnalysisResults() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  // Function to send user input to Flask API
  const handleChatSubmit = async () => {
    if (!userQuery.trim()) return;
    try {
      const response = await axios.post("http://localhost:5000/predict", { question: userQuery });
      setChatResponse(response.data.response);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatResponse("Sorry, I couldn't process your request.");
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="content">
        <div className="header">
          <h1>Analysis Results</h1>
          <div className="actions">
            <button className="action-btn"><Download className="icon" />Download</button>
            <button className="action-btn"><Printer className="icon" />Print</button>
            <button className="action-btn"><Share2 className="icon" />Share</button>
          </div>
        </div>

        {/* Patient Information */}
        <div className="card">
          <h2>Patient Information</h2>
          <div className="info-grid">
            <div><p className="label">Patient Name</p><p className="value">John Doe</p></div>
            <div><p className="label">Date of Birth</p><p className="value">01/15/1980</p></div>
            <div><p className="label">Patient ID</p><p className="value">P12345678</p></div>
            <div><p className="label">Referring Physician</p><p className="value">Dr. Sarah Johnson</p></div>
            <div><p className="label">Analysis Date</p><p className="value">06/15/2023</p></div>
            <div><p className="label">Report ID</p><p className="value">R98765432</p></div>
          </div>
        </div>

        {/* Medication Analysis */}
        <div className="card">
          <h2>Medication Analysis</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Medication</th><th>Dosage</th><th>Frequency</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Lisinopril</td><td>10mg</td><td>Once daily</td><td className="status safe"><CheckCircle className="icon-small" />Safe</td></tr>
              <tr><td>Atorvastatin</td><td>20mg</td><td>Once daily</td><td className="status caution"><AlertCircle className="icon-small" />Caution</td></tr>
              <tr><td>Metformin</td><td>500mg</td><td>Twice daily</td><td className="status safe"><CheckCircle className="icon-small" />Safe</td></tr>
              <tr><td>Aspirin</td><td>81mg</td><td>Once daily</td><td className="status interaction"><AlertCircle className="icon-small" />Interaction</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Chatbot Button */}
      <button className="chatbot-btn" onClick={() => setShowChatbot(!showChatbot)}>
        <MessageCircle className="chat-icon" />
      </button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>AI Chatbot</h3>
            <button onClick={() => setShowChatbot(false)} className="close-btn"><X /></button>
          </div>
          <div className="chatbot-body">
            <p>Hello! How can I assist you today?</p>
            <input 
              type="text" 
              placeholder="Ask a question..." 
              value={userQuery} 
              onChange={(e) => setUserQuery(e.target.value)}
              className="chat-input"
            />
            <button onClick={handleChatSubmit} className="chat-submit">Ask</button>
            {chatResponse && <p className="chat-response">{chatResponse}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
