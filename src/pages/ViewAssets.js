import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewAssets = () => {
  const { property_name } = useParams();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, [property_name]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/assets/property/${property_name}`);
      setAssets(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching assets:', error);
      setError("Error fetching assets details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  if (!Array.isArray(assets) || assets.length === 0) {
    return <div className='text-center mt-5 mb-4'>Assets not found!</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <h3 className='text-center mt-3 mb-4'>
        {assets.length > 0 ? assets[0].property_name : 'Assets'}
      </h3>
      <Link
        to={`/assets/editassets/${property_name}`}
        className="btn btn-primary"
        style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}
      >
        Edit Assets
      </Link>

      <div className='row'>
        {assets.map((asset, index) => (
          <div key={asset._id || index} className='col-md-6 col-lg-6 mb-4'>
            <div className='card shadow-sm rounded p-3'>
              <div className='card-body'>
                <div className='row'>
                  <p><strong>Type:</strong> {asset.type}</p>
                  <p><strong>Description: </strong>{asset.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAssets;
