import React, { useEffect, useState } from "react";
import axios from "axios";

const Protected: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Unauthorized");
      }
    };

    fetchMessage();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default Protected;
