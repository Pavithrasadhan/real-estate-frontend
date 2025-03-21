import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Search from "./Search";
import { FaUserTie, FaArrowLeft } from "react-icons/fa";
import MainFooter from "../components/MainFooter";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AgentListView = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/agent`);
      setAgents(response.data.agent || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      setError("Failed to load agent details. Please try again.");
      setLoading(false);
    }
  };

  const goBackToSearch = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <p className="text-danger">{error}</p>
        <button
          className="btn btn-primary"
          onClick={fetchAgents}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Search />

      <div className="container" style={{ width: "75vw" }}>
        <div className="d-flex justify-content-start mb-4" style={{ marginTop: "-25px" }}>
          <button
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={goBackToSearch}
          >
            <FaArrowLeft className="me-2" /> Back to Search
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No agents found.</h4>
            <p>Please try a different search or check back later.</p>
          </div>
        ) : (
          <div className="row">
            {agents.map((agent) => (
              <div className="col-md-6 col-lg-6 mb-4" key={agent.name}>
                <div
                  className="card agent-card shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/agentdetail/${encodeURIComponent(agent.agent_name)}`)}
                >
                  <div className="row g-0 h-100">
              
                    <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
                      {agent.image ? (
                        <img
                          src={`${backendUrl}/${agent.image.replace(/\\/g, "/")}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "50%", 
                          }}
                          alt="Agent"
                          onError={(e) => {
                            e.target.src = "/path/to/fallback-image.jpg"; 
                          }}
                        />
                      ) : (
                        <FaUserTie size={80} className="text-secondary" />
                      )}
                    </div>

                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title mb-3">{agent.agent_name}</h5>
                        <p className="card-text mb-2">
                          <strong>Year of Experience:</strong> {agent.yearofexperience}
                        </p>
                        <p className="card-text">
                          <strong>Languages:</strong> {agent.languagespoken}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MainFooter />
    </div>
  );
};

export default AgentListView;