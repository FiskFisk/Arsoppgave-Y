import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Notfic.css"; // Import the CSS file

interface Notification {
  message: string;
  timestamp: string;
}

const Notfic: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const username = response.data.message.split(", ")[1];

        // Fetch the user data to get notifications
        const userResponse = await axios.get("/users");
        const user = userResponse.data.users.find((user: any) => user.username === username);
        setNotifications(user.notifications || []); // Set notifications if they exist
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notfic-container">
      <h1>Notifications</h1>
      <div className="notifications">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification">
              <p>{notification.message}</p>
              <small>{notification.timestamp}</small>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notfic;
