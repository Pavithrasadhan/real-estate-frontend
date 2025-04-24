import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const FrontProperties = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Featured");
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/properties`);
            setProperties(response.data.properties || []);
            setFilteredProperties(response.data.properties || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setError("Failed to load properties. Please try again later.");
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (tab === "Featured") {
            setFilteredProperties(properties);
        } else {
            const filtered = properties.filter(property => property.purpose === tab);
            setFilteredProperties(filtered);
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
                    onClick={fetchProperties}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-0 gx-5 align-items-end">
                        <div className="col-lg-6">
                            <div className="text-start mx-auto mb-5 wow slideInLeft" data-wow-delay="0.1s">
                                <h1 className="mb-3">Property Listing</h1>
                            </div>
                        </div>
                        <div className="col-lg-6 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">
                            <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                                <li className="nav-item me-2">
                                    <a
                                        className={`btn ${activeTab === "Featured" ? "active" : ""}`}
                                        style={{ backgroundColor: activeTab === "Featured" ? '#C9184A' : '' }}
                                        onClick={() => handleTabClick("Featured")}
                                    >
                                        Featured
                                    </a>
                                </li>
                                <li className="nav-item me-2">
                                    <a
                                        className={`btn ${activeTab === "For Sale" ? "active" : ""}`}
                                        style={{ backgroundColor: activeTab === "For Sale" ? '#C9184A' : '' }}
                                        onClick={() => handleTabClick("For Sale")}
                                    >
                                        For Sale
                                    </a>
                                </li>
                                <li className="nav-item me-0">
                                    <a
                                        className={`btn ${activeTab === "For Rent" ? "active" : ""}`}
                                        style={{ backgroundColor: activeTab === "For Rent" ? '#C9184A' : '' }}
                                        onClick={() => handleTabClick("For Rent")}
                                    >
                                        For Rent
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                {filteredProperties.slice(0,3).map((property) => (
                                    <div 
                                        className="col-lg-4 col-md-6 wow fadeInUp" 
                                        data-wow-delay="0.1s" 
                                        key={property.id}
                                    >
                                      
                                        <div 
                                            className="property-item rounded overflow-hidden" 
                                            onClick={() => navigate(`/propertydetail/${property.name}`)} 
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="position-relative overflow-hidden">
                                                {property.image && property.image.length > 0 ? (
                                                    <div className="text-center">
                                                        <img
                                                            src={`${backendUrl}/upload/${property.image[0].replace(/\\/g, '/')}`}
                                                            alt="Property"
                                                            className="img-fluid rounded mb-3"
                                                            style={{ maxHeight: "200px", objectFit: "cover" }}
                                                            onError={(e) => {
                                                                e.target.src = '/path/to/fallback-image.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <img
                                                            src="/path/to/fallback-image.jpg"
                                                            alt="Property"
                                                            className="img-fluid rounded mb-3"
                                                            style={{ maxHeight: "200px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3" style={{ backgroundColor: '#C9184A' }}>{property.purpose}</div>
                                                <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{property.type}</div>
                                            </div>
                                            <div className="p-4 pb-0">
                                                <h5 className="mb-3" style={{ color: '#C9184A' }}>AED {property.base_price}</h5>
                                                <a className="d-block h5 mb-2">{property.name}</a>
                                                <p><i className="fa fa-map-marker-alt me-2" style={{ color: '#C9184A' }} />{property.location}</p>
                                            </div>
                                            <div className="d-flex border-top">
                                                <small className="flex-fill text-center border-end py-2">
                                                    <i className="fa fa-ruler-combined me-2" style={{ color: '#C9184A' }} />{property.sqft}
                                                </small>
                                                <small className="flex-fill text-center border-end py-2">
                                                    <i className="fa fa-bed me-2" style={{ color: '#C9184A' }} />{property.beds}
                                                </small>
                                                <small className="flex-fill text-center py-2">
                                                    <i className="fa fa-bath me-2" style={{ color: '#C9184A' }} />{property.baths}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col-12 text-center mt-4">
                                <Link to='/propertylist' className="btn btn py-3 px-5" style={{ backgroundColor: '#C9184A', color: 'white' }}>Browse More Property</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontProperties;
