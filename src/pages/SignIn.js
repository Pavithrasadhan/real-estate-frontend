import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post(`${backendUrl}/api/user/login`, { email, password })
      .then((result) => {
        console.log("Login result:", result);
        const userData = result.data;

        if (userData) {
          const { _id, role, token, first_name } = userData;

          console.log("User role:", role);
          localStorage.setItem("authToken", token);
          localStorage.setItem("userId", _id);
          localStorage.setItem("userName", first_name);

          if (role === "Owner" || role === "Agent") {
            navigate("/home");
          } else if (role === "Buyer") {
            navigate("/");
          } else {
            navigate("/profile");
          }
        } else {
          console.log("Invalid response from server");
          setError("Invalid login response.");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed. Try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="signin-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">Don't have an account?</p>
        <Link to="/signup" className="signup-button">
          Sign Up
        </Link>
        <Link to="/" className="goback-button">
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default SignIn;