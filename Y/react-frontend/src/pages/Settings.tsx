import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Settings.css"; // Styling file

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.delete("/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      localStorage.removeItem("token");
      navigate("/register");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete account.");
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
      <button className="delete-button" onClick={handleDeleteAccount}>
        Delete Account
      </button>
    </div>
  );
};

export default Settings;
