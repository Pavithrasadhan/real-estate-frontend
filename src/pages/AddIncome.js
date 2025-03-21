import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddRecord = () => {
  const [propertyName, setPropertyName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [propertyList, setPropertyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchproperties, setSearchProperties] = useState("");
  const [searchuser, setSearchUser] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    if (searchproperties.trim() === "") {
      fetchProperties();
    } else {
      searchProperties();
    }

    if (searchuser.trim() === "") {
      fetchUser();
    } else {
      searchUser();
    }
  }, [searchproperties, searchuser]);

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
      setUserList(response.data.users || []);
    } catch (error) {
      console.log("Error fetching users");
    }
  };

  const searchProperties = async () => {
    try {
      const params = { search: searchproperties };
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchProperties(value);
    setPropertyName(value);
  };

  const handleUserNameChange = (e) => {
    setSearchUser(e.target.value);  
    setAgentName(e.target.value); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!propertyName || !agentName || !amount || !type) {
      setErrorMessage("All fields are required.");
      return;
    }

    const newRecord = {
      property_name: propertyName,
      agent_name: agentName,
      amount: amount,
      type: type,
    };

    const apiUrl = type === 'Income' ? `${backendUrl}/api/income` : `${backendUrl}/api/expense`;
    
    axios.post(apiUrl, newRecord)
      .then((response) => {
        console.log("Record added successfully:", response.data);
        setPropertyName('');
        setAgentName('');
        setAmount('');
        setType('');
        setErrorMessage("");
        navigate('/income');
      })
      .catch((error) => {
        console.error("Error adding record:", error.response ? error.response.data : error.message);
        setErrorMessage(error.response ? error.response.data.message : "An unexpected error occurred.");
      });
  };

  const handleCancel = () => {
    setPropertyName('');
    setAgentName('');
    setAmount('');
    setType('');
    setErrorMessage(""); 
    navigate('/income');
  };

  const handlePropertiesSelect = (assetName) => {
    setPropertyName(assetName);
    setSearchProperties(''); 
    setPropertyList([]);
  };

  const handleUserSelect = (user) => {
    setAgentName(user.first_name + " " + user.last_name);  
    setSearchUser('');  
    setUserList([]);    
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg w-50 mt-4">
          <div className="card-header text-center">
            <h2 className="mb-4">Add New Income/Expense</h2>
          </div>
          <div className="card-body">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Property Name</label>
                <input
                  className="form-control"
                  value={propertyName}
                  onChange={handleSearchChange}
                  type="text"
                  placeholder="Enter Property Name"
                />
                {searchproperties.trim() !== '' && propertyList.length > 0 && (
                  <ul
                    className="list-group mt-2"
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      width: '100%',
                    }}
                  >
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
              </div>

              <div className="form-group mb-3">
                <label>Agent Name</label>
                <input
                  className="form-control"
                  value={agentName}
                  onChange={handleUserNameChange}
                  type="text"
                  placeholder="Enter Agent Name"
                />
                {searchuser.trim() !== '' && userList.length > 0 && (
                  <ul
                    className="list-group mt-2"
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      width: '100%',
                    }}
                  >
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
                <label>Amount</label>
                <input
                  className="form-control"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter Amount"
                />
              </div>

              <div className="form-group mb-3">
                <label>Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">Add Record</button>
                <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecord;
