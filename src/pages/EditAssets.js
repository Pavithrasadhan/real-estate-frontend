import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditAssets = () => {
  const { property_name } = useParams();
  const navigate = useNavigate();

  const [propertyList, setPropertyList] = useState([]);
  const [assets, setAssets] = useState({
    property_name: '',
    type: '',
    description: '',
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (property_name) {
      fetchAssets();
    }
    fetchPropertyList();
  }, [property_name]);

  const fetchPropertyList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.log('Error fetching properties:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/assets/property/${property_name}`);
      if (response.data.length > 0) {
        setAssets(response.data[0]);
      } else {
        setAssets ({});
      }
      
    } catch (error) {
      console.log('Error fetching assets:', error);
    }
  };

  const handleChange = (e) => {
    setAssets({ ...assets, [e.target.name]: e.target.value });
  };

const handleUserNameChange = (e) => {
  setSearch(e.target.value); 
  setAssets({ ...assets, property_name: e.target.value });
};

const handleUserSelect = (property) => {
  setAssets({ ...assets, property_name: property.name });
  setSearch('');
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting updated assets:', assets);

    try {
      const response = await axios.put(`${backendUrl}/api/assets/property/${property_name}`, assets);
      console.log('Update response:', response.data);
      navigate('/assets');
    } catch (error) {
      console.log('Error updating assets:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card shadow-lg w-50 mt-4">
            <div className="card-header">
              <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Edit Assets
                <button
                  type="submit"
                  className="btn btn-info btn-sm"
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                >
                  <i className="fas fa-save" /> Save
                </button>
              </h2>
            </div>
            <div className="card-body">
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Property Name</label>
                <input
                  className="form-control"
                  value={assets.property_name}
                  onChange={handleUserNameChange}
                  type="text"
                  placeholder="Enter Property Name"
                />
                {search.trim() !== '' && propertyList.length > 0 && (
                  <ul
                    className="list-group mt-2"
                    style={{ position: 'absolute', zIndex: 10, width: '100%' }}
                  >
                    {propertyList.map((property) => (
                      <li
                        key={property._id}
                        className="list-group-item"
                        onClick={() => handleUserSelect(property)}
                        style={{ cursor: 'pointer' }}
                      >
                        {property.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={assets.type}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={assets.description}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAssets;
