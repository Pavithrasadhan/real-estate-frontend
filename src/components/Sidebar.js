import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navigate = useNavigate();

  const toggleSubMenu = (index) => {
    if (activeSubMenu === index) {
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(index);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div>
      <aside className={`main-sidebar ${isSidebarClosed ? 'close' : ''}`} style={{ height: '100vh', overflowY: 'auto' }}>
        <button onClick={() => setIsSidebarClosed(!isSidebarClosed)} className="toggle-sidebar-btn">
          <i className="fas fa-bars" />
        </button>
        <nav id="sidebar" role="navigation">
          <ul>
            <li>
              <Link to="/" className="brand-link">
                <span>Real Estate</span>
              </Link>
            </li>

            <li>
              <Link to="/home">
                <i className="nav-icon fas fa-tachometer-alt" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/user">
                <i className="nav-icon fas fa-user" />
                <span>User</span>
              </Link>
            </li>

            <li>
              <Link to="/agents">
                <i className="nav-icon fas fa-briefcase" />
                <span>Agents</span>
              </Link>
            </li>

            <li>
              <button
                onClick={() => toggleSubMenu(0)}
                className={`dropdown-btn ${activeSubMenu === 0 ? 'rotate' : ''}`}
                aria-expanded={activeSubMenu === 0}
              >
                <i className="nav-icon fas fa-building" />
                <span>Properties</span>
                <i className="fas fa-angle-right right" />
              </button>
              <ul className={`sub-menu ${activeSubMenu === 0 ? 'show' : ''}`}>
                <div>
                  <li className="dropdown-item">
                    <Link to="/properties" className="nav-link">
                      <span>List of Property</span>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/assets" className="nav-link">
                      <span>Assets</span>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/documents" className="nav-link">
                      <span>Documents</span>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/income" className="nav-link">
                      <span>Income/Expense</span>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link to="/leads" className="nav-link">
                      <span>Leads</span>
                    </Link>
                  </li>
                </div>
              </ul>
            </li>

            <li>
              <button
                onClick={() => toggleSubMenu(1)}
                className={`dropdown-btn ${activeSubMenu === 1 ? 'rotate' : ''}`}
                aria-expanded={activeSubMenu === 1}
              >
                <i className="nav-icon fas fa-table" />
                <span>Master Table</span>
                <i className="fas fa-angle-right right" />
              </button>
              <ul className={`sub-menu ${activeSubMenu === 1 ? 'show' : ''}`}>
                <div>
                  <li className="dropdown-item">
                    <Link to="/amenities" className="nav-link">
                      <span>Amenities</span>
                    </Link>
                  </li>
                </div>
              </ul>
            </li>

            <li>
              <Link to="/message">
                <i className="nav-icon fas fa-comments" />
                <span>Message</span>
              </Link>
            </li>

            <li style={{ marginTop: 'auto', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: '90%', textAlign: 'center' }}
              >
                <i className="nav-icon fas fa-sign-out-alt" style={{ color: 'white' }} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;