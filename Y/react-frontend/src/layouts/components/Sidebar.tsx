import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo"></div>
      <button onClick={() => navigate("/protected")}>Home</button>
      <button onClick={() => navigate("/notfic")}>Notifications</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      <button>Settings</button>
    </div>
  );
};

export default Sidebar;
