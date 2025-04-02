import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import AdditionalContent from "./components/AdditionalContent.tsx";
import Protected from "../pages/Protected.tsx";
import Profile from "../pages/Profile.tsx";
import "./styles/MainLayout.css";

const MainLayout: React.FC = () => {
  return (
    <div className="container">
      <Sidebar />
      
      <div className="content-area">
        <Routes>
          <Route path="/protected" element={<Protected />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      <div className="divider" />

      <AdditionalContent />
    </div>
  );
};

export default MainLayout;
