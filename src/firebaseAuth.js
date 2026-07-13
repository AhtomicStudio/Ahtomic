import { getAuth } from "firebase/auth";
import { app, firebaseConfig } from "./firebase";

// Auth only — imported exclusively by admin code (Login.jsx, AdminGate.jsx,
// AdminDashboard.jsx, AdminInquiries.jsx), all of which live in the lazy
// admin chunk. Keeping this in its own module means firebase/auth's SDK
// only loads for someone actually visiting /admin or /login.
let auth;
try {
  if (firebaseConfig.apiKey && app) {
    auth = getAuth(app);
  }
} catch (e) {
  console.error("Failed to initialize Firebase Auth:", e);
}

export { auth };
