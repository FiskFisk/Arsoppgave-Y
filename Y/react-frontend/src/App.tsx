import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout"; // Use MainLayout for protected routes

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<MainLayout />} /> {/* Main layout handles all protected routes */}
      </Routes>
    </Router>
  );
};

export default App;
