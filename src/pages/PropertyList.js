import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Search from './Search';
import MainFooter from "../components/MainFooter";
import { FaUserCircle } from 'react-icons/fa';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PropertyList = () => {
    const { agent_name } = useParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperty();
    }, [agent_name]);

    const fetchProperty = async () => {
        try {
            const url = `${backendUrl}/api/properties`;
            const response = await axios.get(url);
            setProperties(response.data.properties || []);
        } catch (error) {
            console.error("Error fetching property:", error);
            setError("Error fetching property details. Please try again.");
        } finally {
            setLoading(false);
        }
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
                    onClick={fetchProperty}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!Array.isArray(properties) || properties.length === 0) {
        return (
            <div className="text-center mt-5">
                <h4>No properties found.</h4>
                <p>Please try a different search or check back later.</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Search />

            <div className="container mb-2" style={{ marginTop: '-10px', width: '100vw' }}>
                <h3 className="text-center mb-4">Properties for Sale in UAE</h3>
                <div className="row">
                    {properties.map((property, index) => (
                        <div key={index} className="col-12 mb-4">
                            <div
    className="card property-card shadow-sm d-flex flex-column flex-md-row align-items-center"
    onClick={() => navigate(`/propertydetail/${property.name}`)}
    style={{
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "transform 0.3s ease",
    }}
>
    <div 
        className="property-image"
        style={{
            flex: '0 0 40%',
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            position: 'relative'
        }}
    >
        {property.image && property.image.length > 0 && (
            <img
                src={`${backendUrl}/${property.image[0].replace(/\\/g, '/')}`}
                alt="Property"
                className="img-fluid"
                style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                }}
                onError={(e) => {
                    e.target.src = "/images/fallback-image.jpg";
                }}
            />
        )}
    </div>

    <div 
        className="property-details text-start"
        style={{
            flex: '0 0 60%',
            padding: '12px',
            width: '100%'
        }}
    >
        <p className="text-muted mb-1 ">{property.type}</p>
        <h5 className="property-price">AED {property.base_price}</h5>
        <p className="property-name">{property.name}</p>
        <p className="property-location">{property.location}</p>
        <p className="card-text">
            <i className="fa fa-bed me-2" />{property?.beds || 0} Beds |{" "}
            <i className="fa fa-bath me-2" />{property?.baths || 0} Baths |{" "}
            <i className="fa fa-ruler-combined me-2" />{property?.sqft}
        </p>

        <div className="d-flex gap-3 mt-3">
            <Link
                to={
                    property.owner_name
                        ? `/ownerdetails/${property.owner_name.split(' ')[0]}`
                        : `/agentdetail/${property.agent_name.split(' ')[0]}`
                }
                className="btn btn-outline-primary rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                style={{
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontWeight: '500',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d6efd';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = '#0d6efd';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <FaUserCircle size={24} style={{ color: '#0d6efd', transition: 'color 0.3s ease' }} />
                {property.owner_name || property.agent_name}
            </Link>
        </div>
    </div>
</div>

                        </div>
                    ))}
                </div>
            </div>

            <MainFooter />
        </div>
    );
};

export default PropertyList;
