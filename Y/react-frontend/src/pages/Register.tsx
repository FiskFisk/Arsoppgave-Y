import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://10.2.2.63:5000/register", { // Replace <your-ip> with your actual IP or localhost
        username,
        email,
        password,
      });
      navigate("/login"); // Navigate to login page on successful registration
    } catch (error) {
      console.error("Registration failed", error); // Log error for debugging
      alert("Registration failed. Please try again."); // Optionally alert the user
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")} // Navigate to the login page
          style={{ cursor: "pointer", color: "blue" }}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
