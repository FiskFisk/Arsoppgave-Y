import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // Import the CSS file

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://10.2.2.63:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      alert("Login successful!");
      navigate("/protected");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="logo"></div> {/* Placeholder for the logo */}
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate("/")}>Register</span>
      </p>
    </div>
  );
};

export default Login;