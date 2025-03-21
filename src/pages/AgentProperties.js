import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Search from './Search';
import { FaCamera, FaMapMarkerAlt,FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import MainFooter from '../components/MainFooter';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AgentProperties = () => {
    const { property_name, agent_name, role, first_name } = useParams();
    const [property, setProperty] = useState(null);
    const [Amenities, setAmenities] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [showAllImages, setShowAllImages] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [showMap, setShowMap] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProperty();
        fetchAmenities();
    
    }, [property_name, agent_name, role, first_name]);

    const fetchProperty = async () => {
        try {
            const url = `${backendUrl}/api/properties/search/${property_name}`;
            const response = await axios.get(url);
            if (response.data.length > 0) {
                setProperty(response.data[0]);
                setExpanded({});
                if (response.data[0].image && response.data[0].image.length > 0) {
                    setMainImage(`${backendUrl}/${response.data[0].image[0].replace(/\\/g, '/')}`);
                }
            } else {
                setProperty(null);
            }
        } catch (error) {
            console.error("Error fetching property:", error);
            setError("Error fetching property details.");
        } finally {
            setLoading(false);
        }
    };
    

    const fetchAmenities = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/amenities`);
            setAmenities(response.data.amenities || []);
        } catch (error) {
            console.log("Error fetching Amenities Icon");
        }
    };

    const toggleExpand = (index) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleMapClick = () => {
        const googleMapsUrl = property?.location
            ? `https://www.google.com/maps?q=${encodeURIComponent(property.location)}`
            : "";
        if (googleMapsUrl) {
            window.open(googleMapsUrl, '_blank');
        }
    };

    const goBackToSearch = () => {
        navigate('/propertylist');
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
    if (!property) return <div className="text-center mt-5">No property found for this {property_name}.</div>;

    const amenitiesList = Array.isArray(property.amenities)
        ? property.amenities
        : typeof property.amenities === 'string'
        ? property.amenities.split(",")
        : [];

    const googleMapsUrl = property?.location
        ? `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`
        : "";

    return (
        <div>
            <Navbar />
            <Search />
            <div className="container mt-4">
                <div>
                <button
                className="btn btn-outline-success mb-3"
                onClick={goBackToSearch}
                style={{ fontWeight: 'bold' }}
            >
                        &lt; Back to Search
                    </button>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="position-relative">
                            <img
                                src={mainImage}
                                alt="Property"
                                className="img-fluid rounded"
                                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                            />
                            <div
                                className="position-absolute bottom-0 start-0 mb-2 ms-2 p-2 rounded-circle bg-dark"

                                style={{
                                    
                                    cursor: 'pointer',
                                }}
                                onClick={() => setShowAllImages(true)}
                    >
                                <FaCamera color="white" size={30} />
                            </div>
                            <div
                                className="position-absolute bottom-0 start-0 mb-2 ms-5 p-2 rounded-circle bg-dark"
                                style={{
                        
                                    cursor: 'pointer',
                                }}
                                onClick={handleMapClick}
                            >
                                <FaMapMarkerAlt color="white" size={30} />
                            </div>
                        </div>

                        {showMap && property?.location && (
                            <div
                                className="modal-overlay"
                                style={{
                                    position: 'fixed',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '90%',
                                    maxWidth: '600px',
                                    backgroundColor: '#fff',
                                    padding: '20px',
                                    borderRadius: '10px',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                                    zIndex: 1000,
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Property Location</h5>
                                    <button className="btn btn-close" onClick={() => setShowMap(false)}></button>
                                </div>
                                <iframe
                                    src={googleMapsUrl}
                                    width="100%"
                                    height="300px"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        )}

                        <div className="d-flex mt-2 flex-wrap">
                            {property.image.slice(0, 2).map((img, i) => (
                                <img
                                    key={i}
                                    src={`${backendUrl}/${img.replace(/\\/g, '/')}`}
                                    alt={`Thumbnail ${i}`}
                                    className={`rounded m-1 ${mainImage === `${backendUrl}/${img.replace(/\\/g, '/')}` ? 'active' : ''}`}
                                    onClick={() => setMainImage(`${backendUrl}/${img.replace(/\\/g, '/')}`)}
                                    style={{
                                        width: '100px',
                                        height: '75px',
                                        objectFit: 'cover',
                                        cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-9">
                            <div className="property-info">
                            <div className="d-flex justify-content-between align-items-center">
  <p className="mb-0">
      <span style={{ fontSize: '30px' }}>
          AED <span style={{ fontSize: '40px' }}>{property?.base_price || 0}</span>
      </span>
  </p>

  <p className="mb-0 text-end">
      <i className="fa fa-bed me-2" /> {property?.beds || 0} <span className="ms-1">Beds</span> |{' '}
      <i className="fa fa-bath me-2" /> {property?.baths || 0} <span className="ms-1">Baths</span> |{' '}
      <i className="fa fa-ruler-combined me-2" /> {property?.sqft || 0} <span className="ms-1">sqft</span>
  </p>
</div>
<p>
    <strong>{property?.location || 'N/A'}</strong>
</p>
<hr />
<strong><p>{property.name}</p></strong>
<p>

        <span
            style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: expanded['description'] ? 'none' : 5,
                lineHeight: '1.5',
            }}
        >
            {property.description}
        </span>
    
    <button
        className="btn btn-link p-0 ms-2"
        onClick={() => toggleExpand('description')}
        style={{ fontSize: '14px' }}
    >
        {expanded['description'] ? 'Show Less' : 'Read More'}
    </button>
</p>
<hr />
                               <h4 className="mt-4 mb-4">Property Information</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-3">
                                            <strong style={{ marginRight: '110px' }}>Type:</strong> {property.type}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '85px' }}>Purpose:</strong>{' '}
                                            {property.purpose}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="mb-3">
                                            <strong style={{ marginRight: '40px' }}>Furnished:</strong>{' '}
                                            {property.furnished ? 'Yes' : 'No'}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '30px' }}>Added Date:</strong>{' '}
                                            {property.addedDate}
                                        </p>
                                        
                                    </div>
                                </div>
                                <hr />
                                <h4 className="mt-4 mb-4">Building Information</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-3">
                                            <strong style={{ marginRight: '40px' }}>Building Name:</strong>{' '}
                                            {property.buildingName}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '10px' }}>Year of Completion:</strong>{' '}
                                            {property.yearofcompletion}
                                        </p>
                                    </div>
                                    <div className="col-md-3">
                                        <p>
                                            <strong style={{ marginRight: '70px' }}>Floors:</strong>{' '}
                                            {property.floors}
                                        </p>
                                    </div>
                                </div>
                                <hr />
                                <h4 className="mt-4 mb-4">Amenities</h4>
                                <div className="row">
                                    {amenitiesList.map((amenityName, i) => {
                                        const matchingAmenity = Amenities?.find(
                                            (a) => a.name.toLowerCase() === amenityName.toLowerCase()
                                        );
                                        return (
                                            <div key={i} className="col-md-3 mb-3">
                                                <div
                                                    className="card shadow-sm d-flex flex-column align-items-center justify-content-center text-center p-3"
                                                    style={{ height: '80px' }}
                                                >
                                                    {matchingAmenity?.icon && (
                                                        <i
                                                            className={`fa ${matchingAmenity.icon}`}
                                                            style={{
                                                                fontSize: '24px',
                                                                marginBottom: '5px',
                                                            }}
                                                        />
                                                    )}
                                                    <span className="fw-bold">{amenityName}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <hr />
                                <h4 className="mt-4 mb-4">Regulatory Information</h4>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>
                                            <strong style={{ marginRight: '60px' }}>Permit No:</strong>{' '}
                                            {property.permitNo}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '100px' }}>BRN:</strong>{' '}
                                            {property.BRN}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '100px' }}>DED:</strong>{' '}
                                            {property.DED}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '90px' }}>RERA:</strong>{' '}
                                            {property.RERA}
                                        </p>
                                        <p>
                                            <strong style={{ marginRight: '90px' }}>RefId:</strong>{' '}
                                            {property.RefId}
                                        </p>
                                    </div>

                                    <div className="col-md-3">
                                        <p>
                                            <strong>QR code:</strong>
                                            {property.QRcode && (
                                                <div className="text-center mt-3">
                                                   <img
    src={`${backendUrl}/${property.QRcode.replace(/\\/g, '/')}`}
    alt="QR Code"
    className="img-fluid"
    style={{ maxWidth: '100px' }}
/>


                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-3'>
  <div className='row'>
  {property.owner_name ? (
  <div className='col-md-12 mb-4'>
    <div className='card shadow-sm rounded p-3'>
      <div className='card-body text-center'>
      <h5 className='mb-2'>Agent</h5>
        <p><strong>{property.owner_name.split(' ')[0]}</strong></p>
        <Link to={`/ownerdetails/${property.owner_name.split(' ')[0]}`} className='btn btn-warning btn-sm'>
          <i className='fas fa-phone' />
        </Link>
      </div>
    </div>
  </div>
) : property.agent_name ? (
  <div className='col-md-12 mb-4'>
    <div className='card shadow-sm rounded p-3'>
      <div className='card-body text-center'>
        <h5 className='mb-2'>Agent</h5>
        <p><strong>{property.agent_name.split(' ')[0]}</strong></p>
        <Link to={`/agentdetail/${property.agent_name.split(' ')[0]}`} className='btn btn-warning btn-sm'>
          <i className='fas fa-phone' />
        </Link>
      </div>
    </div>
  </div>
) : (
  <p className="text-center text-muted">No owner or agent assigned</p>
)}

  </div>
</div>
</div>
    </div>
    </div>
            

    {showAllImages && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="modal-content bg-white p-4 rounded"
                        style={{ maxWidth: '90%', maxHeight: '90%', overflowY: 'auto' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>All Images</h5>
                            <button className="btn btn-close" onClick={() => setShowAllImages(false)}></button>
                        </div>
                        <div className="row">
                            {property.image.map((img, i) => (
                                <div key={i} className="col-md-4 mb-3">
                                    <img
                                        src={`${backendUrl}/${img.replace(/\\/g, '/')}`}
                                        alt={`Image ${i}`}
                                        className="img-fluid rounded"
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                        onClick={() => setMainImage(`${backendUrl}/${img.replace(/\\/g, '/')}`)}  
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <MainFooter />
        </div>
    );
};

export default AgentProperties;
