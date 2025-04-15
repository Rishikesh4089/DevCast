import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + (err as Error).message);
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
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="input"
            />
            <button type="submit" className="btn">Log In</button>
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
