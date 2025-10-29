import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'
import './styles/index.css'


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="873040070851-negu0ooto64pe63kr5g6gclgv8t6h9u5.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
