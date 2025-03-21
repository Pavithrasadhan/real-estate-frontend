import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddLeads = () => {
  const [property_name, setPropertyName] = useState('');
  const [buyer_name, setBuyerName] = useState('');
  const [agent_name, setAgentName] = useState('');
  const [status, setStatus] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [buyerList, setBuyerList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [searchProperty, setSearchProperty] = useState('');
  const [searchuser, setSearchUser] = useState('');
  const [searchbuyer, setSearchBuyer] = useState('');
  const [error, setError] = useState('');
  const [buyerError, setBuyerError] = useState('');
  const [agentError, setAgentError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchProperty.trim() === "") {
      fetchProperties();
    } else {
      searchProperties();
    }

    if (searchuser.trim() === "") {
      fetchUser();
    } else {
      searchUser();
    }

    if (searchbuyer.trim() === "") {
      fetchBuyer();
    } else {
      searchBuyer(); 
    }
  }, [searchProperty, searchuser, searchbuyer]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.log("Error fetching properties");
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Agent' }
      });
      setAgentList(response.data.users || []);
    } catch (error) {
      console.log("Error fetching users");
    }
  };

  const fetchBuyer = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Buyer' }
      });
      setBuyerList(response.data.users || []);
    } catch (error) {
      console.log("Error fetching buyers");
    }
  };

  const searchProperties = async () => {
    try {
      const params = { search: searchProperty };
      const response = await axios.get(`${backendUrl}/api/search/properties`, { params });
      setPropertyList(response.data.properties || []);

      if(response.data.properties.length === 0){
        setError('properties not found');
      }else{
        setError('');
      }
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  const searchUser = async () => {
    try {
      const params = { search: searchuser, role: 'Agent' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setAgentList(response.data.users || []);

      if (response.data.users.length === 0) {
        setAgentError('Agent not found');
      } else {
        setAgentError('');
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const searchBuyer = async () => {
    try {
      const params = { search: searchbuyer, role: 'Buyer' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setBuyerList(response.data.users || []); 

      if (response.data.users.length === 0) {
        setBuyerError('Buyer not found');
      } else {
        setBuyerError('');
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchProperty(value);
    setPropertyName(value);
  };

  const handleUserNameChange = (e) => {
    setSearchUser(e.target.value);  
    setAgentName(e.target.value); 
  };

  const handleBuyerNameChange = (e) => {
    setSearchBuyer(e.target.value);
    setBuyerName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!property_name || !buyer_name || !agent_name || !status) {
      alert("Please fill in all fields.");
      return;
    }

    const newLeads = { property_name, buyer_name, agent_name, status };

    axios.post(`${backendUrl}/api/lead`, newLeads)
      .then((response) => {
        console.log(response.data);
        setPropertyName('');
        setBuyerName('');
        setAgentName('');
        setStatus('');
        navigate('/leads');
      })
      .catch((error) => console.log(error));
  };

  const handleCancel = () => {
    setPropertyName('');
    setBuyerName('');
    setAgentName('');
    setStatus('');
    navigate('/leads');
  };

  const changeStatusHandler = (event) => {
    setStatus(event.target.value);
  };

  const handlePropertiesSelect = (assetName) => {
    setPropertyName(assetName);
    setSearchProperty('');
  };

  const handleUserSelect = (user) => {
    setAgentName(user.first_name + " " + user.last_name);
    setSearchUser('');
  };

  const handleBuyerSelect = (user) => {
    setBuyerName(user.first_name + " " + user.last_name);
    setSearchBuyer('');
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg w-50 mt-4">
          <div className="card-header text-center">
            <h2 className="mb-4">Add New Leads</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Property Name</label>
                <input
                  className="form-control"
                  value={property_name}
                  onChange={handleSearchChange}
                  type="text"
                  placeholder='Enter Property Name'
                />
                {searchProperty.trim() !== '' && propertyList.length > 0 && (
                  <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                    {propertyList.map((property) => (
                      <li
                        key={property._id}
                        className="list-group-item"
                        onClick={() => handlePropertiesSelect(property.name)}
                        style={{ cursor: "pointer" }}
                      >
                        {property.name}
                      </li>
                    ))}
                  </ul>
                )}
                {error && <div className="text-danger">{error}</div>}
              </div>

              <div className="form-group mb-3">
                <label>Buyer Name</label>
                <input
                  className="form-control"
                  value={buyer_name}
                  onChange={handleBuyerNameChange}
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
                {buyerError && <div className="text-danger">{buyerError}</div>}
              </div>

              <div className="form-group mb-3">
                <label>Agent Name</label>
                <input
                  className="form-control"
                  value={agent_name}
                  onChange={handleUserNameChange}
                  type="text"
                  placeholder='Enter Agent Name'
                />
                {searchuser.trim() !== '' && agentList.length > 0 && (
                  <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                    {agentList.map((user) => (
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
                {agentError && <div className="text-danger">{agentError}</div>}
              </div>

              <div className="mb-3">
                <label>Status:</label>
                <select
                  className="form-select"
                  aria-label="Select Status"
                  onChange={changeStatusHandler}
                >
                  <option value="">Select Status</option>
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">Add Leads</button>
                <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeads;
