import React, { useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      // Optionally save to a "users" table in Supabase (if you're using it)
      await supabase.from("users").insert([
        {
          id: data.user?.id,
          email,
          name,
          created_at: new Date(),
          role: "user",
        },
      ]);

      navigate("/profile");
    } catch (err: any) {
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div className="signup-page">
      <h1 className="signup-title">DevCast</h1>
      <div className="signup-container">
        <div className="signup-left">
          <form onSubmit={handleSignup} className="signup-form fade-in-up">
            <h2>Sign Up</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="input" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="input" />
            <button type="submit" className="btn">Sign Up</button>
            <p className="redirect-text">
              Already a member?{" "}
              <Link to="/login" className="redirect-link">Log in</Link>
            </p>
          </form>
        </div>
        <div className="signup-right">
          <img src="../../signup.jpeg" alt="Signup" className="floating-img" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
