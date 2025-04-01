import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import Profile from "./pages/Profile"; // Import the Profile component
import Notfic from "./pages/Notfic"; // Import the Notfic component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notfic" element={<Notfic />} /> {/* New route for Notifications */}
      </Routes>
    </Router>
  );
};

export default App;
