import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewPropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const { role, name } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!role || !name) {
        setError("Name parameter is missing.");
        setLoading(false);
        return;
      }

      try {
        const url = `${backendUrl}/api/properties/${role}/${name}`;
        const response = await axios.get(url);
        setProperties(response.data);
        setExpanded({});
      } catch (error) {
        console.error("Error fetching property:", error);
        setError("Error fetching property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [role, name]); // Only role and name are needed in the dependency array

  const toggleExpand = (index) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!Array.isArray(properties) || properties.length === 0) {
    return <div className="text-center mt-5">No properties found for this {role}.</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <h3 className="text-center mt-3 mb-4">Property Listings</h3>
      <div className="row">
        {properties.map((property, index) => (
          <div key={index} className="col-md-6 col-lg-6 mb-4">
            <div className="card shadow-sm rounded p-3">
              {property.image && property.image.length > 0 && (
                <div className="text-center">
                  <img
                    src={`${backendUrl}/${property.image[0].replace(/\\/g, '/')}`}
                    alt="Property"
                    className="img-fluid rounded mb-3"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="card-body">
                <div className='row'>
                  <div className='col-md-6'>
                    <p><strong>Owner:</strong> {property.owner_name}</p>
                    <p><strong>Agent:</strong> {property.agent_name}</p>
                    <p><strong>Property Name:</strong> {property.name}</p>
                    <p><strong>Type:</strong> {property.type}</p>
                    <p><strong>Purpose:</strong> {property.purpose}</p>
                    <p><strong>Price:</strong> ${property.base_price}</p>
                    <p><strong>Amenities:</strong></p>
                    <ul className="list-unstyled">
                      {(Array.isArray(property.amenities)
                        ? property.amenities
                        : property.amenities.split(",")
                      )
                        .slice(0, expanded[index] ? property.amenities.length : 3)
                        .map((amenity, i) => (
                          <li key={i}>✅ {amenity.trim()}</li>
                        ))}
                    </ul>

                    <p><strong>Furnished:</strong> {property.furnished ? "Yes" : "No"}</p>
                    <p><strong>Location:</strong> {property.location}</p>
                    <p><strong>Map Link:</strong> <a href={property.mapLink} target="_blank" rel="noopener noreferrer">View Map</a></p>
                  </div>
                  <div className='col-md-6'>
                    <p><strong>Building Name:</strong> {property.buildingName}</p>
                    <p><strong>Year of Completion:</strong> {property.yearofcompletion}</p>
                    <p><strong>Floors:</strong> {property.floors}</p>
                    <p><strong>Permit No:</strong> {property.permitNo}</p>
                    <p><strong>BRN:</strong> {property.BRN}</p>
                    <p><strong>DED:</strong> {property.DED}</p>
                    <p><strong>RERA:</strong> {property.RERA}</p>
                    <p><strong>RefId:</strong> {property.RefId}</p>
                    <p><strong>Visibility:</strong> {property.visibility}</p>
                    <p><strong>Status:</strong> {property.status}</p>
                  </div>
                </div>
                <p><strong>Beds:</strong> {property.beds} | <strong>Baths:</strong> {property.baths} | <strong>Sqft:</strong> {property.sqft}</p>
                <p><strong>Available From:</strong> {property.availablefrom}</p>
                <p><strong>Added Date:</strong> {property.addedDate}</p>

                <p>
                  <strong>Description:</strong>
                  {expanded[index] ? property.description : `${property.description.slice(0, 100)}...`}
                  <button
                    className="btn btn-link p-0 ms-2"
                    onClick={() => toggleExpand(index)}
                    style={{ fontSize: "14px" }}
                  >
                    {expanded[index] ? "Show Less" : "Read More"}
                  </button>
                </p>

                {property.QRcode && (
                  <div className="text-center mt-3">
                    <img
                      src={`${backendUrl}/${property.QRcode.replace(/\\/g, '/')}`}
                      alt="QR Code"
                      className="img-fluid"
                      style={{ maxWidth: "100px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPropertyList;
