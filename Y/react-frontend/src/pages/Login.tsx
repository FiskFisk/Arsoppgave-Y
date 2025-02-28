import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://10.2.2.63:5000/login", { // Corrected to /login
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token); // Correct access token key
      alert("Login successful!");
      navigate("/protected");
    } catch (error) {
      console.error("Login error:", error); // Log error for debugging
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px" }}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/")} // Navigate to the register page
          style={{ cursor: "pointer", color: "blue" }}
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
