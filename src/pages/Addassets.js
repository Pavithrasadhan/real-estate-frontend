import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Backend URL from environment variable
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddAssets = () => {
  const [propertyName, setPropertyName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [propertyList, setPropertyList] = useState([]);
  const [search, setSearch] = useState("");
  const [propertyError, setPropertyError] = useState("");
  const navigate = useNavigate();

  // Fetch properties based on search or all properties
  useEffect(() => {
    if (search.trim()) {
      searchProperties();
    } else {
      fetchProperties();
    }
  }, [search]);

  // Fetch all properties
  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  // Search properties based on input
  const searchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/search/properties`, {
        params: { search },
      });
      setPropertyList(response.data.properties || []);

      if (response.data.properties.length === 0) {
        setPropertyError("Property not found");
      } else {
        setPropertyError("");
      }
    } catch (error) {
      console.error("Error searching properties:", error);
      setPropertyError("Failed to search properties");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!propertyName.trim() || !type.trim() || !description.trim()) {
      alert("All fields are required");
      return;
    }

    const newAsset = { property_name: propertyName, type, description };

    try {
      await axios.post(`${backendUrl}/api/assets`, newAsset);
      alert("Asset added successfully");
      resetForm();
      navigate("/assets");
    } catch (error) {
      console.error("Error adding asset:", error);
      alert("Failed to add asset");
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    resetForm();
    navigate("/assets");
  };

  // Reset form fields
  const resetForm = () => {
    setPropertyName("");
    setType("");
    setDescription("");
    setSearch("");
    setPropertyList([]);
    setPropertyError("");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPropertyName(value);
    setSearch(value);
  };

  // Handle property selection from dropdown
  const handlePropertySelect = (propertyName) => {
    setPropertyName(propertyName);
    setSearch("");
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg w-50 mt-4">
          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Add New Asset</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
                Add Asset
              </button>
              <button className="btn btn-danger" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Property Name */}
              <div className="form-group mb-3 position-relative">
                <label>Property Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={propertyName}
                  onChange={handleSearchChange}
                  placeholder="Search or Enter Property Name"
                  required
                />
                {/* Dropdown suggestions */}
                {search.trim() !== "" && propertyList.length > 0 && (
                  <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 10, maxHeight: "150px", overflowY: "auto" }}>
                    {propertyList.map((property) => (
                      <li
                        key={property._id}
                        className="list-group-item"
                        onClick={() => handlePropertySelect(property.name)}
                        style={{ cursor: "pointer" }}
                      >
                        {property.name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Error message */}
                {propertyError && <div className="text-danger mt-1">{propertyError}</div>}
              </div>

              {/* Type */}
              <div className="form-group mb-3">
                <label htmlFor="type">Type</label>
                <input
                  id="type"
                  className="form-control"
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Enter Type"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group mb-3">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    minHeight: "100px",
                  }}
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssets;
