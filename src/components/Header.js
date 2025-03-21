import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Header() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="fixed-top" style={{ height: '60px' }}>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light bg-light">
        <ul className="navbar-nav" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <li className="nav-item">
              <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                <i className="fas fa-bars" />
              </a>
            </li>
            <li className="nav-item d-none d-sm-inline-block">
              <Link to="/" className="nav-link">Home</Link>
            </li>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {userName ? (
              <div className="navbar-nav ms-auto" style={{ display: "flex", alignItems: "center" }}>
                <Link to="/profile">
                  <span className="nav-item nav-link">Welcome, {userName}</span>
                </Link>
              </div>
            ) : (
              <Link to="/signin" className="nav-item nav-link" style={{ textDecoration: "none" }}>
                Sign In
              </Link>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Header;