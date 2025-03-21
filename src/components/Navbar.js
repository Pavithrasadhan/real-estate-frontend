import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    setUserName("");
    navigate("/");
  };

  return (
    <div className="nav-bar bg-transparent" style={{ marginTop: '0px', width: '100vw', background: 'transparent' }}>
      <nav className="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
        <Link to='/' className="navbar-brand d-flex align-items-center text-center">
          <h1 className="m-0" style={{ color: '#C9184A' }}>Real Estate</h1>
        </Link>
        <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto">
            <Link to='/' className="nav-item nav-link">Home</Link>
            <Link to="/agentlistview" className="nav-item nav-link">Find My Agent</Link>
            <Link to='/propertylist' className="nav-item nav-link">Property</Link>
            <Link to="/contact" className="nav-item nav-link">Contact</Link>
          </div>

          {userName ? (
            <div className="navbar-nav ms-auto">
              <Link to="/profile"><span className="nav-item nav-link">Welcome, {userName}</span></Link>
              <button className="nav-item nav-link btn btn-link" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <Link to="/signin" className="nav-item nav-link">
              SIGNIN
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;