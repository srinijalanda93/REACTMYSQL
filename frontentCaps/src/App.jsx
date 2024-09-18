// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import AttendancePage from './AttendancePage';

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={authToken ? <Navigate to="/profile" /> : <LoginPage setAuthToken={setAuthToken} />} />
        <Route path="/profile" element={authToken ? <ProfilePage authToken={authToken} /> : <Navigate to="/" />} />
        <Route path="/attendance" element={authToken ? <AttendancePage authToken={authToken} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
