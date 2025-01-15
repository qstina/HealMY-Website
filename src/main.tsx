import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Login from './Login.tsx';
import SignUp from './Signup.tsx';
import SetUsername from './SetUsername';
import Home from './Home';
import Profile from './Profile';
import Community from './Community.tsx';
import MoodTracker from './MoodTracker.tsx';
import MoodCalendar from './MoodCalendar.tsx';
import Landing from './Landing.tsx';
import ResourcesModule from './Resources.tsx';
import JournalModule from './Journal.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB6b17vRWUg6oEwtEUjT9RRw7Aots7skFU",
  authDomain: "healmy-788fb.firebaseapp.com",
  projectId: "healmy-788fb",
  storageBucket: "healmy-788fb.firebasestorage.app",
  messagingSenderId: "977984053027",
  appId: "1:977984053027:web:fac62470dd8cfc72dd3696",
  measurementId: "G-KET3M03Y9Z",
};

// Initialize Firebase
initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/set-username" element={<SetUsername />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/moodtracker" element={<MoodTracker />} />
        <Route path="/moodcalendar" element={<MoodCalendar />} />
        <Route path="/resources" element={<ResourcesModule />} />
        <Route path="/journal" element={<JournalModule />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
