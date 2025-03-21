import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserTie, FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Search from './Search';
import MainFooter from '../components/MainFooter';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const OwnerDetails = () => {
    const { owner_name } = useParams(); 
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwnerDetails(owner_name);
        fetchProperties(owner_name);
    }, [owner_name]);

    const fetchOwnerDetails = async (owner_name) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/Owner?name=${owner_name}`);
            setOwnerDetails(response.data);
        } catch (error) {
            console.error("Error fetching owner details:", error);
            setError("Failed to fetch owner details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProperties = async (name) => {
        try {
            const response = await axios.get(`${backendUrl}/api/properties/owner/${name}`);
            setProperties(response.data);
        } catch (error) {
            console.error("Error fetching properties");
            setError("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    const viewPropertyDetails = (propertyName) => {
        navigate(`/propertydetail/${propertyName}`);
    };

    if (loading) return <div>Loading owner details...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div>
            <Navbar />
            
            {ownerDetails && (
                <div className="p-3 border-0">
                    <div className="row">
                        <div className="col-md-4 d-flex align-items-center justify-content-center p-2">
                            {ownerDetails?.image ? (
                                <img
                                    src={`${backendUrl}/${ownerDetails.image.replace(/\\/g, "/")}`}
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                    alt="Owner"
                                />
                            ) : (
                                <FaUserTie size={80} className="text-secondary" />
                            )}
                        </div>

                        <div className="col-md-8 d-flex flex-column justify-content-center">
                            <h4 className="mb-2 text-start">{ownerDetails?.first_name || 'N/A'}</h4>
                            <span className="text-muted fs-6 text-start mb-4">Real Estate Expert</span>

                            <div className="d-flex gap-3">
                                {ownerDetails?.email && (
                                    <a href={`mailto:${ownerDetails?.email}`} className="text-decoration-none">
                                        <div className="card p-2 d-flex flex-row align-items-center justify-content-center text-primary border-0"
                                            style={{ width: "100px", height: "40px" }}>
                                            <FaEnvelope size={20} className="me-2" />
                                            <div>Mail</div>
                                        </div>
                                    </a>
                                )}

                                {ownerDetails?.phone && (
                                    <a href={`tel:${ownerDetails?.phone}`} className="text-decoration-none">
                                        <div className="card p-2 d-flex flex-row align-items-center justify-content-center text-success border-0"
                                            style={{ width: "100px", height: "40px" }}>
                                            <FaPhone size={20} className="me-2" />
                                            <div>Call</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <hr />

            <div className="container" style={{ width: '80vw', marginTop: '20px' }}>
                <div className="row">
                    <h5 style={{ marginLeft: '50px' }}>Active Properties</h5>
                    <Search />
                    {properties.length === 0 ? (
                        <div className="text-center mt-5">No properties found for {owner_name}.</div>
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
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => viewPropertyDetails(property?.name)}
                                    >
                                        <div className="row g-0">
                                            {property?.image && property.image.length > 0 && (
                                                <div className="col-md-3 d-flex align-items-center justify-content-center">
                                                    <img
                                                        src={`${backendUrl}/${property.image[0]?.replace(/\\/g, "/")}`}
                                                        alt="Property"
                                                        className="img-fluid rounded mb-3"
                                                        style={{ height: "100%", objectFit: "cover", width: "100%" }}
                                                    />
                                                </div>
                                            )}
                                            <div className="col-md-9">
                                                <div className="card-body" style={{ paddingLeft: '30px' }}>
                                                    <p className='text-start'>{property?.type}</p>
                                                    <p className="property-price"> AED {property?.base_price || 'N/A'}</p>
                                                    <p className="property-name"> {property?.name || 'N/A'}</p>
                                                    <p className="property-location">{property?.location || 'N/A'}</p>
                                                    <p className="property-type">
                                                         
                                                        <i className="fa fa-bed" /> {property?.beds || 0} beds |
                                                        <i className="fa fa-bath" /> {property?.baths || 0} baths |
                                                        <i className="fa fa-ruler-combined" /> {property?.sqft || 0}
                                                    </p>

                                        
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <MainFooter />
        </div>
    );
};

export default OwnerDetails;
