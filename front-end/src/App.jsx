import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/Nav/Navbar";
import Home from "./components/Home/Home";
import UploadScreen from "./components/Upload Screen/UploadScreen";
import AnalysisResults from "./components/Analysis/AnalysisResult";

const ProtectedRoute = ({ children }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  ) || <RedirectToSignIn />;
};

export default function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar is always visible */}

      <Routes>
        {/* Public Home/Login Page */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route path="/upload-screen" element={<ProtectedRoute><UploadScreen /></ProtectedRoute>} />
        <Route path="/analysis-results" element={<ProtectedRoute><AnalysisResults /></ProtectedRoute>} />

        {/* Redirect to Sign-In if not authenticated */}
        <Route path="/sign-in" element={<SignIn redirectUrl="/" />} />
      </Routes>
    </Router>
  );
}
