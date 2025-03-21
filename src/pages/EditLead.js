import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditLead = () => {
  const { property_name } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState({
    property_name: '',
    buyer_name: '',
    agent_name: '',
    status: '',
  });

  const [propertyList, setPropertyList] = useState([]);
  const [buyerList, setBuyerList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchProperty, setSearchProperty] = useState('');
  const [searchuser, setSearchUser] = useState('');
  const [searchbuyer, setSearchBuyer] = useState('');

  useEffect(() => {
    
      fetchLead();
    }, []);

    useEffect(() => {

    if (searchProperty.trim() === '') {
      fetchPropertyList();
    } else {
      searchProperties();
    }

    if (searchuser.trim() === '') {
      fetchUserList();
    } else {
      searchUser();
    }

    if (searchbuyer.trim() === '') {
      fetchBuyer();
    } else {
      searchBuyer();
    }
  }, [searchProperty, searchuser, searchbuyer, property_name]);

  const fetchLead = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lead/property/${property_name}`);
      console.log("Lead Response:", response.data);
      if (response.data.length > 0) {
        setLead(response.data[0]);
      } else {
        setLead({});
      }
      setLoading(false);
    } catch (error) {
      console.log('Error fetching lead:', error);
      setLoading(false);
    }
  };

  const fetchPropertyList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.log('Error fetching properties:', error);
    }
  };

  const fetchUserList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Agent' }
      });
      setUserList(response.data.users || []);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const fetchBuyer = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Buyer' }
      });
      setBuyerList(response.data.users || []);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const searchProperties = async () => {
    try {
      const params = { search: searchProperty };
      const response = await axios.get(`${backendUrl}/api/search/properties`, { params });
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  const searchUser = async () => {
    try {
      const params = { search: searchuser, role: 'Agent' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setUserList(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const searchBuyer = async () => {
    try {
      const params = { search: searchbuyer, role: 'Buyer' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setBuyerList(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${backendUrl}/api/lead/property/${property_name}`, lead);
      console.log("Update response:", response.data);
      navigate('/leads');
    } catch (error) {
      console.log('Error updating lead:', error);
    }
  };

  const handleSearchPropertyChange = (e) => {
    setLead({...lead, property_name: e.target.value});
    setSearchProperty(e.target.value);
   
  };

  const handleSearchUserChange = (e) => {
    setSearchUser(e.target.value);
    setLead((prevLead) => ({ ...prevLead, agent_name: e.target.value }));
  };

  const handleSearchBuyerChange = (e) => {
    setSearchBuyer(e.target.value);
    setLead((prevLead) => ({ ...prevLead, buyer_name: e.target.value }));
  };

  const handlePropertiesSelect = (property) => {
    setLead((prevLead) => ({ ...prevLead, property_name: property.name }));
    setSearchProperty('');
  };

  const handleUserSelect = (user) => {
    setLead((prevLead) => ({ ...prevLead, agent_name: `${user.first_name} ${user.last_name}` }));
    setSearchUser('');
  };

  const handleBuyerSelect = (user) => {
    setLead((prevLead) => ({ ...prevLead, buyer_name: `${user.first_name} ${user.last_name}` }));
    setSearchBuyer('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='card shadow-lg w-50 mt-4'>
      <div className="card-header text-center">
        <h2 className='mb-4'>Edit Lead</h2>
        </div>
        <div className='card-body'>
      <form onSubmit={handleSubmit}>
    
        <div className="form-group mb-3">
          <label>Property Name</label>
          <input
            className="form-control"
            name="property_name"
            value={lead.property_name}
            onChange={handleSearchPropertyChange}
            type="text"
            placeholder='Enter Property Name'
          />
          {searchProperty.trim() !== '' && propertyList.length > 0 && (
            <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
              {propertyList.map((property) => (
                <li
                  key={property._id}
                  className="list-group-item"
                  onClick={() => handlePropertiesSelect(property)}
                  style={{ cursor: "pointer" }}
                >
                  {property.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group mb-3">
          <label>Agent Name</label>
          <input
            className="form-control"
            name="agent_name"
            value={lead.agent_name}
            onChange={handleSearchUserChange}
            type="text"
            placeholder='Enter Agent Name'
          />
          {searchuser.trim() !== '' && userList.length > 0 && (
            <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
              {userList.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item"
                  onClick={() => handleUserSelect(user)}
                  style={{ cursor: "pointer" }}
                >
                  {user.first_name} {user.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group mb-3">
          <label>Buyer Name</label>
          <input
            className="form-control"
            name="buyer_name"
            value={lead.buyer_name}
            onChange={handleSearchBuyerChange}
            type="text"
            placeholder='Enter Buyer Name'
          />
          {searchbuyer.trim() !== '' && buyerList.length > 0 && (
            <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
              {buyerList.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item"
                  onClick={() => handleBuyerSelect(user)}
                  style={{ cursor: "pointer" }}
                >
                  {user.first_name} {user.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-3">
          <label>Status</label>
          <select
            name="status"
            className="form-select"
            value={lead.status || ''}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-info btn-sm"
          style={{ marginRight: '10px', marginBottom: '10px' }}
        >
          <i className="fas fa-save" /> Save
        </button>
      </form>
      </div>
      </div>
      </div>
    </div>
  );
};

export default EditLead;
