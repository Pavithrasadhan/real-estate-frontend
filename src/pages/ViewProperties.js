import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewProperties = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({ description: false });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching property:", error);
      setError("Error fetching property details.");
      setLoading(false);
    }
  };

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!property) {
    return <div>Property not found!</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <h5 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {property ? property.name : 'Property not found'}
        <div className='row d-flex gap-4'>
          <div className='col-md-2'>
            {property && property.name && (
              <Link to={`/assets/viewassets/${property.name}`} className="btn btn-primary" style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}>
                Assets
              </Link>
            )}
          </div>
          <div className='col-md-2'>
            <Link to={`/income/viewincome/${property.name}`} className="btn btn-primary" style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '140px' }}>
              Income/Expense
            </Link>
          </div>
          <div className='col-md-2'>
            <Link to={`/documents/viewdocuments/${property.name}`} className="btn btn-primary" style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}>
              Documents
            </Link>
          </div>
          <div className='col-md-2'>
            <Link to={`/leads/viewleads/${property.name}`} className="btn btn-primary" style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}>
              Leads
            </Link>
          </div>
        </div>
      </h5>

      <div className="row">
        <div className="col-md-4">
          <table className="table" style={{ marginTop: '4px' }}>
            <tbody>
              <tr>
                <th>Owner</th>
                <td>{property.owner_name}</td>
              </tr>
              <tr>
                <th>Agent</th>
                <td>{property.agent_name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>
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
                </td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{property.type}</td>
              </tr>
              <tr>
                <th>Purpose</th>
                <td>{property.purpose}</td>
              </tr>
              <tr>
                <th>Base Price</th>
                <td>{property.base_price}</td>
              </tr>
              <tr>
                <th>Amenities</th>
                <td>
                  <div style={{ display: "grid", gap: "10px", maxHeight: "50px", overflowY: "auto", paddingRight: "10px" }}>
                    <ul>
                      {Array.isArray(property.amenities)
                        ? property.amenities.map((amenity, index) => <li key={index}>{amenity}</li>)
                        : typeof property.amenities === "string"
                          ? property.amenities
                              .replace(/[\[\]']+/g, "")
                              .split(",")
                              .map((amenity, index) => <li key={index}>{amenity.trim()}</li>)
                          : null}
                    </ul>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Beds</th>
                <td>{property.beds}</td>
              </tr>
              <tr>
                <th>Baths</th>
                <td>{property.baths}</td>
              </tr>
              <tr>
                <th>Sqft</th>
                <td>{property.sqft}</td>
              </tr>
              <tr>
                <th>Furnished</th>
                <td>{property.furnished}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <table className="table" style={{ marginTop: '4px' }}>
            <tbody>
              <tr>
                <th>Location</th>
                <td>{property.location}</td>
              </tr>
              <tr>
                <th>Available from</th>
                <td>{property.availablefrom}</td>
              </tr>
              <tr>
                <th>Added Date</th>
                <td>{property.addedDate}</td>
              </tr>
              <tr>
                <th>Visibility</th>
                <td>{property.visibility}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{property.status}</td>
              </tr>
              <tr>
                <th>Building Name</th>
                <td>{property.buildingName}</td>
              </tr>
              <tr>
                <th>Year of Completion</th>
                <td>{property.yearofcompletion}</td>
              </tr>
              <tr>
                <th>Floors</th>
                <td>{property.floors}</td>
              </tr>
              <tr>
                <th>Permit NO</th>
                <td>{property.permitNo}</td>
              </tr>
              <tr>
                <th>DED</th>
                <td>{property.DED}</td>
              </tr>
              <tr>
                <th>RERA</th>
                <td>{property.RERA}</td>
              </tr>
              <tr>
                <th>BRN</th>
                <td>{property.BRN}</td>
              </tr>
              <tr>
                <th>Ref Id</th>
                <td>{property.RefId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-4">
          <table className="table" style={{ marginTop: '4px' }}>
            <tbody>
              <tr>
                <th>Images</th>
                <td>
                  <div style={{ display: "grid", gap: "10px", maxHeight: "200px", overflowY: "auto", gridTemplateColumns: "repeat(2, 1fr)", paddingRight: "10px" }}>
                    {Array.isArray(property.image) && property.image.length > 0 && (
                      <div>
                        {property.image.map((img, index) => (
                          <img
                            key={index}
                            src={`${backendUrl}/${img.replace(/\\/g, '/')}`}
                            alt={`Property Image ${index + 1}`}
                            style={{ width: '100%', margin: '10px', height: 'auto', display: 'block' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <th>QR Code</th>
                <td>
                  {property.QRcode && (
                    <img
                      src={`${backendUrl}/${property.QRcode.replace(/\\/g, '/')}`}
                      alt="QR Code"
                      style={{ width: '100px', margin: '10px' }}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProperties;
