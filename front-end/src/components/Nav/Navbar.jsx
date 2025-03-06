import React from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-box"></div>
        <span className="logo-text">PharmacoGenius</span>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">Homepage</Link>

        {/* Protected Links */}
        <SignedIn>
          <Link to="/upload-screen" className="nav-link">Upload Screen</Link>
          <Link to="/analysis-results" className="nav-link">Analysis Results</Link>
        </SignedIn>
      </div>

      <div className="nav-right">
        {/* Show Sign Up when logged out */}
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="btn-outline">Sign Up</button>
          </SignUpButton>
        </SignedOut>

        {/* Show User Profile when logged in */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
