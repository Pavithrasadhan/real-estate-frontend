import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditRecord = () => {
  const { property_name } = useParams();
  const navigate = useNavigate();
  const [propertyList, setPropertyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchproperties, setSearchProperties] = useState(""); 
  const [searchuser, setSearchUser] = useState("");
  const [record, setRecord] = useState({
    property_name: "",
    agent_name: "",
    amount: "",
    type: "Income",
  });

  useEffect(() => {
    fetchRecord();
  }, []);

  useEffect(() => {
    if (searchproperties.trim() === "") {

      fetchPropertyList();
      
    } else {
      searchProperties();
      
    }

    if (searchuser.trim() === ""){
      fetchUserList();
    }else {
      searchUser();
    }
  }, [ searchproperties, searchuser ]);

  const fetchRecord = async () => {
    try {
      const incomeResponse = await axios.get(
        `${backendUrl}/api/income/property/${property_name}`
      );
      const expenseResponse = await axios.get(
        `${backendUrl}/api/expense/property/${property_name}`
      );
  
      console.log('Income Response:', incomeResponse.data);
      console.log('Expense Response:', expenseResponse.data);
  
      const combinedRecords = [
        ...(incomeResponse.data),
        ...(expenseResponse.data),
      ];
  
      if (combinedRecords.length > 0) {
        setRecord(combinedRecords[0]);
      } else {
        setRecord({});
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };
  
  const fetchPropertyList = async () => {
    try {
      const params = {search: searchProperties}
      const response = await axios.get(`${backendUrl}/api/properties`, {params});
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchUserList = async () => {
    try {
      const params = {search: searchuser, role: 'Agent'}
      const response = await axios.get(`${backendUrl}/api/user`, {
        params
      });
      setUserList(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]); 
    }
  };
  const searchProperties = async () => {
    try {
      const params = { search: searchproperties };
      const response = await axios.get(
        `${backendUrl}/api/search/properties`,
        { params }
      );
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error("Error searching properties:", error);
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
    setRecord({...record, property_name: e.target.value});
    setSearchProperties(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setSearchUser(e.target.value);
    setRecord((prevRecord) => ({...prevRecord, agent_name: e.target.value}));
  };

  const handlePropertySelect = (property) => {
    setRecord((prevRecord) => ({ ...prevRecord, property_name: property.name }));
    setSearchProperties("");
  };

  const handleUserSelect = (user) => {
    setRecord((prevRecord) => ({ ...prevRecord, agent_name: `${user.first_name} ${user.last_name}` }));
    setSearchUser('');
  }

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (record.type === "Income") {
        await axios.put(
          `${backendUrl}/api/income/property/${property_name}`,
          record
        );
      } else if (record.type === "Expense") {
        await axios.put(
          `${backendUrl}/api/expense/property/${property_name}`,
          record
        );
      }
      navigate("/income");
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <h2 className="content-header">
        Edit {record.type}
      </h2>
      <form onSubmit={handleSubmit}>
      
        <div className="form-group">
          <label>Property Name</label>
          <input
            className="form-control"
            value={record.property_name}
            onChange={handleSearchChange}
            type="text"
            placeholder="Enter Property Name"
          />
          {searchproperties.trim() !== "" && propertyList.length > 0 && (
            <ul
              className="list-group mt-2"
              style={{ position: "absolute", zIndex: 10, width: "100%" }}
            >
              {propertyList.map((property) => (
                <li
                  key={property._id}
                  className="list-group-item"
                  onClick={() => handlePropertySelect(property)}
                  style={{ cursor: "pointer" }}
                >
                  {property.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
        <label>Agent Name</label>
                <input
                  className="form-control"
                  value={record.agent_name}
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

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={record.amount}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            className="form-select"
            value={record.type}
            onChange={(e) => setRecord({ ...record, type: e.target.value })}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-info btn-sm"
          style={{ marginRight: "10px", marginBottom: "10px" }}
        >
          <i className="fas fa-save" /> Save
        </button>
      </form>
    </div>
  );
};

export default EditRecord;
