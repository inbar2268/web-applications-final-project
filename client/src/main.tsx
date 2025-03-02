import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./Componnents/App.tsx";
import {GoogleOAuthProvider} from '@react-oauth/google'


createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId='712113192105-3a83jk5apcotfgpmuc7shr70v5jn6uog.apps.googleusercontent.com'>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
);
