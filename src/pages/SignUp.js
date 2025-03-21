import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function SignUp() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeRoleHandler = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      setError("Please select a role.");
      return;
    }
    setLoading(true);
    setError(null);

    axios.post(`${backendUrl}/api/user/register`, {
      first_name, last_name, email, phone, password, role
    })
    .then(result => {
      console.log(result);

      if(result.data.success){
        setLoading(false);
        setError(result.data.message || "SignUp failed");
        return;
      }

      setLoading(false);
     setError(null);
      navigate('/signin');
    })
    .catch(error => {
      console.error(error);
      setLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Signup failed, please try again.");
      }
    });
  };

  return (
    <div className="signup-container">
      
        <div className="signup-box">
          <h2 className="signup-title">Sign Up</h2>
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="row">
              <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="first_name">
                <span>First Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                autoComplete="off"
                name="first_name"
                className="form-control "
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">
                <span>Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                autoComplete="off"
                name="last_name"
                className="form-control rounded-0"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <span>Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="form-control rounded-0"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
    </div>
    <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="phone">
                <span>Phone</span>
              </label>
              <input
                type="text"
                placeholder="Enter Phone Number"
                autoComplete="off"
                name="phone"
                className="form-control rounded-0"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select
                className="form-select"
                aria-label="role"
                onChange={changeRoleHandler}
                value={role}
                required
              >
                <option value="">Select Role</option>
                <option value="Owner">Owner</option>
                <option value="Agent">Agent</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>
            </div>
            {error && <p className='text-danger  text-center'>{error}</p>}
            <button disabled={loading} type="submit" className="signup-button">
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
        </div>
          </form>
        
          <p>Already have an account?</p>
          <Link
            to="/signin"
            className="login-button"
          >
            Login
          </Link>
        </div>
        
      </div>
    
  );
}

export default SignUp;
