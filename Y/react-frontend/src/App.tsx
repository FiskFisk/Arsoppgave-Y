import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Notfic from "./pages/Notfic";
import MainLayout from "./layouts/MainLayout"; // Use MainLayout for protected routes

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainLayout />} /> {/* Main layout handles protected routes */}
        <Route path="/notfic" element={<Notfic />} />
      </Routes>
    </Router>
  );
};

export default App;
