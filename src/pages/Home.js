import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBuilding, FaUserTie, FaUsers } from 'react-icons/fa';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [useragents, setUserAgents] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchUserAgent();
    fetchProperties();
    fetchAgent();
    fetchLeads();
  }, []);

  const fetchUserAgent = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Agent' }
      });
      setUserAgents(response.data.users || []);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const fetchAgent = async () => {
    try {
      const responseagent = await axios.get(`${backendUrl}/api/agent`);
      setAgents(responseagent.data.agent || []);
    } catch (error) {
      console.log("Error fetching agents:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lead`);
      setLeads(response.data.leads || []);
    } catch (error) {
      console.log("Error fetching leads:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="content-header luxury-header text-center py-5"
        style={{
          marginTop: "60px",
          backgroundColor: "#4a90e2",
          color: "#fff",
          borderRadius: "12px"
        }}
      >
        <h1>Welcome to Real Estate Dashboard</h1>
      </div>

      <div className="row mt-4">
        <div className="col-lg-4 col-md-6 col-12 mb-3">
          <div
            className="card luxury-card shadow-sm"
            style={{
              background: "#88C0D0",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body text-center">
              <FaBuilding size={40} className="mb-2" />
              <h5>Total Properties</h5>
              <p className="display-6 fw-bold">{properties.length}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 mb-3">
          <div
            className="card luxury-card shadow-sm"
            style={{
              background: "#FCF4F0",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body text-center">
              <FaUserTie size={40} className="mb-2" />
              <h5>Total Agents</h5>
              <p className="display-6 fw-bold">{agents.length + useragents.length}</p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 mb-3">
          <div
            className="card luxury-card shadow-sm"
            style={{
              background: "#C6CEBE",
              borderRadius: "12px",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body text-center">
              <FaUsers size={40} className="mb-2" />
              <h5>Total Leads</h5>
              <p className="display-6 fw-bold">{leads.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
