import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Backend URL from environment file
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddAmenities = () => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const navigate = useNavigate();

  // Fetch amenities for future use or validation (optional)
  useEffect(() => {
    axios.get(`${backendUrl}/api/amenities`)
      .then(response => console.log(response.data))
      .catch(error => console.error("Error fetching amenities:", error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !icon.trim()) {
      alert("Both name and icon are required");
      return;
    }

    const newAmenities = { name, icon };

    axios.post(`${backendUrl}/api/amenities`, newAmenities)
      .then(response => {
        console.log(response.data);
        setName('');
        setIcon('');
        navigate('/amenities'); // Redirect after successful addition
      })
      .catch(error => {
        console.error("Error adding amenities:", error);
        alert("Failed to add amenities. Please try again.");
      });
  };

  // Handle cancel action
  const handleCancel = () => {
    setName('');
    setIcon('');
    navigate('/amenities');
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <div className="d-flex justify-content-center align-items-center">
        <div className="card shadow-lg w-50 mt-4">
          <div className="card-header text-center">
            <h2 className="mb-4">Add New Amenities</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="form-group mb-3">
                <label>Name</label>
                <input
                  className="form-control"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                />
              </div>

              {/* Icon Input */}
              <div className="form-group mb-3">
                <label>Icon</label>
                <input
                  className="form-control"
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Enter Icon"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                  Add Amenities
                </button>
                <button className="btn btn-danger" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAmenities;
