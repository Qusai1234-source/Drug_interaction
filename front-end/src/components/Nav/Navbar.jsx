import React from "react";
<<<<<<< HEAD
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css"; // Linking the CSS file

const pageVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

// Cool Animated Button Variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1, 
    backgroundImage: "linear-gradient(135deg, #007bff, #00d4ff)", 
    color: "#fff",
    transition: { type: "spring", stiffness: 300, damping: 10 }
  },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
  idle: { 
    scale: [1, 1.05, 1], 
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
  }
};

const Navbar = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key={location.pathname}
        className="navbar"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="logo">
          <div className="logo-box"></div>
          <span className="logo-text">SafeMed</span>
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
              <motion.button 
                className="btn-outline"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                Sign Up
              </motion.button>
            </SignUpButton>
          </SignedOut>

          {/* Show User Profile when logged in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </motion.nav>
    </AnimatePresence>
=======
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
>>>>>>> AI
  );
};

export default Navbar;
