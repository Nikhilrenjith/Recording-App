import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Login.css"; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password }
      );
      if (response.status === 200) {
        console.log("Login successful");
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="body">
        <div className="login-container">
          <h2 className="login-heading">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
          <Link to="/register" className="login-link">
            New User ? Click here
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
