import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";  // Import Clerk
import "./index.css"; 

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;  // Use Vite environment variable

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
