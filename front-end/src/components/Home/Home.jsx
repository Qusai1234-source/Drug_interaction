import React from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Play } from "lucide-react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Revolutionize Your Health</h1>
        <p>Empowering you with personalized pharmaceutical insights</p>

        <div className="hero-buttons">
          {/* Show Sign In Button when Signed Out */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="primary-btn">Sign In</button>
            </SignInButton>
          </SignedOut>

          {/* Show Profile & Redirect Button when Signed In */}
          <SignedIn>
            <UserButton />
            <button className="primary-btn" onClick={() => navigate("/upload-screen")}>
              Go to Upload Screen
            </button>
          </SignedIn>
        </div>

        {/* Video Placeholder */}
        <div className="video-container">
          <div className="play-button">
            <Play className="play-icon" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature">
          <div className="feature-icon pink"></div>
          <h3>Personalized medication insights</h3>
          <p>Drug interaction alerts</p>
        </div>
        <div className="feature">
          <div className="feature-icon primary"></div>
          <h3>User-friendly interface</h3>
        </div>
        <div className="feature">
          <div className="feature-icon blue"></div>
          <h3>Comprehensive medication database</h3>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Subscribe to our newsletter</h3>
          <div className="subscribe">
            <input type="email" placeholder="Type your email" />
            <button>Subscribe</button>
          </div>
          <p>© 2024 PharmacoGenius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
