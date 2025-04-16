// pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      // Error is already handled in the auth context
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-title">DevCast</h1>
      <div className="login-container">
        <div className="login-left">
          <img
            src="../../loginn.png"
            alt="Login"
            className="floating-img"
          />
        </div>
        <div className="login-right">
          <form onSubmit={handleLogin} className="login-form fade-in-up">
            <h2>Log In</h2>
            {error && <div className="error-message">{error}</div>}
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input"
              disabled={loading}
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <p className="redirect-text">
              New user?{" "}
              <Link to="/signup" className="redirect-link">
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;