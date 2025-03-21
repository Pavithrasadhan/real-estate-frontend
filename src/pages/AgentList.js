import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPhone, FaStar, FaLanguage } from "react-icons/fa";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AgentList = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/agent`);
            setAgents(response.data.agent || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching agents:", error);
            setError("Failed to load agents. Please try again later.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-5">
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
        <div className="agent-list-container">
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-0 gx-5 align-items-end">
                        <div className="col-lg-6">
                            <div className="text-start mx-auto mb-5">
                                <h1 className="mb-3">Agent Listing</h1>
                                <p className="lead">Meet our professional agents ready to assist you.</p>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                {agents.slice(0, 3).map((agent) => (
                                    <div className="col-lg-4 col-md-6" key={agent.id}>
                                        <div className="agent-card rounded overflow-hidden shadow-sm p-4 text-center d-flex flex-column align-items-center">
                                
                                            <div className="agent-image mb-3">
                                                {agent.image ? (
                                                    <img
                                                        src={`${backendUrl}/${agent.image.replace(/\\/g, '/')}`}
                                                        alt="Agent"
                                                        className="img-fluid rounded-circle"
                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = '/path/to/fallback-image.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                                        style={{ width: '100px', height: '100px' }}>
                                                        
                                                    </div>
                                                )}
                                            </div>

                                            <h5 className="mb-2" style={{ color: '#C9184A' }}>{agent.agent_name}</h5>

                                            <p className="agent-contact d-flex align-items-center justify-content-center mb-2">
                                                <FaPhone className="me-2" /> {agent.contact_info}
                                            </p>

                                            <p className="agent-experience d-flex align-items-center justify-content-center mb-2">
                                                <FaStar className="me-2" /> Experience: {agent.yearofexperience} years
                                            </p>

                                            <p className="agent-languages d-flex align-items-center justify-content-center mb-2">
                                                <FaLanguage className="me-2" /> Languages: {agent.languagespoken}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-12 text-center mt-4">
                                <Link to="/agentlistview" className="btn btn py-3 px-5" style={{ backgroundColor: '#C9184A', color: 'white' }}>
                                    Browse More Agents
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentList;