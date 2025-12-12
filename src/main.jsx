import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'
import './styles/index.css'


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="379410863733-go2iuv5hiuacqeirhk0edi0kobj3lkdm.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
