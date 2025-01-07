import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Login from './Login.tsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB6b17vRWUg6oEwtEUjT9RRw7Aots7skFU",
  authDomain: "healmy-788fb.firebaseapp.com",
  projectId: "healmy-788fb",
  storageBucket: "healmy-788fb.firebasestorage.app",
  messagingSenderId: "977984053027",
  appId: "1:977984053027:web:fac62470dd8cfc72dd3696",
  measurementId: "G-KET3M03Y9Z"
};

// Initialize Firebase
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />        
      </Routes>
    </Router>
  </React.StrictMode>,
)
