import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

interface SidebarProps {
  role: string | null; // Accepts role as a prop
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo"></div>
      <button onClick={() => navigate("/protected")}>Home</button>
      <button onClick={() => navigate("/notfic")}>Notifications</button>
      <button onClick={() => navigate("/profile")}>Profile</button>
      {role === "Admin" && (  // Conditional rendering for Admin links
        <>
          <button onClick={() => navigate("/tables")}>Admin Statistic Table</button>
          <button onClick={() => navigate("/admininfo")}>Admin Info</button>
        </>
      )}
      <button>Settings</button>
    </div>
  );
};

export default Sidebar;
