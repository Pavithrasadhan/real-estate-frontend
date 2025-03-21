import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import MainFooter from "../components/MainFooter";
import Search from "./Search";
import { FaUserTie, FaEnvelope, FaPhone } from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AgentDetails = () => {
  const { agent_name } = useParams();
  const [properties, setProperties] = useState([]);
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (agent_name) {
      const encodedName = encodeURIComponent(agent_name);
      fetchAgentDetails(encodedName);
      fetchProperty(encodedName);
    }
  }, [agent_name]);
  

  const fetchAgentDetails = async (encodedName) => {
    try {
      const response = await axios.get(`${backendUrl}/api/agent/name/${encodedName}`);
      setAgentDetails(response.data);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      setError("Failed to load agent details.");
    }
  };

  const fetchProperty = async (encodedName) => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties/agent/${encodedName}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching agent properties:", error);
      setError("Failed to load agent properties.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToSearch = () => {
    navigate("/agentlistview");
  };

  const viewPropertyDetails = (name) => {
    navigate(`/agentproperties/${name}`); 
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="d-flex justify-content-start mb-2" style={{ marginTop: '-20px' }}>
          <button className="btn btn" style={{ color: 'green', fontStyle: 'oblique', fontWeight: 'bold' }} onClick={goBackToSearch}>
            &lt; Back to Search
          </button>
        </div>

        {agentDetails && (
          <div className="p-3 border-0">
            <div className="row">
              <div className="col-md-4 d-flex align-items-center justify-content-center p-2">
                {agentDetails.image ? (
                  <img
                    src={`${backendUrl}/${agentDetails.image.replace(/\\/g, "/")}`}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                    alt="Agent"
                  />
                ) : (
                  <FaUserTie size={80} className="text-secondary" />
                )}
              </div>

              <div className="col-md-8 d-flex flex-column justify-content-center">
                <h4 className="mb-2 text-start">{agentDetails.agent_name}</h4>
                <span className="text-muted fs-6 text-start mb-4">Real Estate Expert</span>

                <div className="d-flex gap-3">
                  <a href={`mailto:${agentDetails.email}`} className="text-decoration-none">
                    <div className="card p-2 d-flex flex-row align-items-center justify-content-center text-primary border-0"
                      style={{ width: "100px", height: "40px" }}>
                      <FaEnvelope size={20} className="me-2" />
                      <div>Mail</div>
                    </div>
                  </a>

                  <a href={`tel:${agentDetails.contact_info}`} className="text-decoration-none">
                    <div className="card p-2 d-flex flex-row align-items-center justify-content-center text-success border-0"
                      style={{ width: "100px", height: "40px" }}>
                      <FaPhone size={20} className="me-2" />
                      <div>Call</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr />

      <div className="container" style={{ width: '80vw', marginTop: '20px' }}>
        <div className="row">
          <h5 style={{ marginLeft: '50px' }}>Active Properties</h5>
          <div style={{ marginLeft: '20px' }}><Search /></div>

          {properties.length === 0 ? (
            <div className="text-center mt-5">No properties found for {agent_name}.</div>
          ) : (
            <div className="col-md-8">
              <div className="property-column" style={{ marginTop: '20px', marginLeft: '30px' }}>
                {properties.map((property, index) => (
                  <div
                    key={index}
                    className="p-3"
                    style={{
                      width: '50vw',
                      marginBottom: '20px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                    onClick={() => viewPropertyDetails(property.name)}
                  >
                    <div className="row g-0">
                      {property.image && property.image.length > 0 && (
                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                          <img
                            src={`${backendUrl}/${property.image[0].replace(/\\/g, "/")}`}
                            alt="Property"
                            className="img-fluid rounded mb-3"
                            style={{ height: "100%", objectFit: "cover", width: "100%" }}
                          />
                        </div>
                      )}
                      <div className="col-md-9">
                        <div className="card-body" style={{ paddingLeft: '30px' }}>
                          <p className="text-start">{property.type}</p>
                          <p className="property-price"> AED {property.base_price}</p>
                          <p className="property-name"> {property.name}</p>
                          <p className="property-location">{property.location}</p>
                          <p className="property-type">
                            <i className="fa fa-bed" /> {property.beds} beds |
                            <i className="fa fa-bath" /> {property.baths} baths |
                            <i className="fa fa-ruler-combined" /> {property.sqft}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {agentDetails && (
            <div className="col-md-4">
              <div className="p-3 border-0">
                <h4>About</h4>
                <div className="row align-items-start">
                  <div className="col-12">
                    <p><strong>Language:</strong> {agentDetails.languagespoken}</p>
                    <p><strong>Expertise:</strong> {agentDetails.expertise}</p>
                    <p><strong>Experience:</strong> {agentDetails.yearofexperience} years</p>
                    <p><strong>BRN:</strong> {agentDetails.BRN}</p>
                    <p><strong>Description:</strong> {agentDetails.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <MainFooter />
    </div>
  );
};

export default AgentDetails;
