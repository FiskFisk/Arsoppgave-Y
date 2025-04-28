import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Register.css"; // Import the CSS file

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Function to validate username
  const isUsernameValid = (username: string) => {
    const regex = /^[A-Za-z0-9]+$/; // Allows only letters and numbers
    return regex.test(username);
  };

  return (
    <div className="register-container">
      <div className="logo"></div> {/* Placeholder for the logo */}
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        maxLength={16} // Set maximum length to 16 characters
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleRegister}
        disabled={!isUsernameValid(username) || username.length === 0} // Disable button if username is invalid or empty
      >
        Register
      </button>
      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
};

export default Register;
