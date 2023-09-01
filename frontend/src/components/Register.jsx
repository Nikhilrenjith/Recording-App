import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../CSS/Register.css"; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username,
        password,
      });
      console.log("User registered successfully");
    } catch (error) {
      console.error("Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="body">
        <div className="register-container">
          <h2 className="register-heading">Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <button onClick={handleRegister} className="register-button">
            Register
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
