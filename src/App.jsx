// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/profile";  
import Settings from "./pages/Settings";  
import FindMatches from "./pages/FindMatches";
import FindUsers from "./pages/FindUsers";
import PostMatches from "./pages/PostMatches";


export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Automatically hide splash screen after 2-3 seconds 
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/FindMatches" element={<FindMatches />} /> 
        <Route path="/FindUsers" element={<FindUsers />} /> 
        <Route path="/PostMatches" element={<PostMatches />} /> 
      </Routes>
    </Router>
  );
}
