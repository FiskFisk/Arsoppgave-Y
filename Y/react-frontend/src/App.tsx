import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Protected from "./pages/Protected";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </Router>
  );
};

export default App;
