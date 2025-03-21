import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditAmenities = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [amenities, setAmenities] = useState({
    name: '',
    icon: '',
  });

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/amenities/${id}`);
      setAmenities(response.data);
    } catch (error) {
      console.log('Error fetching expense:', error);
    }
  };

  const handleChange = (e) => {
    setAmenities({ ...amenities, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/amenities/${id}`, amenities);
      navigate('/amenities');
    } catch (error) {
      console.log('Error updating amenities:', error);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='card shadow-lg w-50 mt-4'>
      <div className='card-header text-center'>
        <h2 className='mb-4'>Edit Amenities</h2>
        </div>
        <div className='card-body'>
      <form onSubmit={handleSubmit}>
    
        <div className="form-group mb-3">
          <label>Name</label>
          <input
          type="text"
            name="name"
            value={amenities.name}
            onChange={handleChange}
            className="form-control"
          />
          </div>
          <div className="form-group mb-3">
          <label>Icon</label>
          <input
          type="text"
            name="icon"
            value={amenities.icon}
            onChange={handleChange}
            className="form-control"
          />
          </div>
        <button type="submit" className="btn btn-info btn-sm" style={{ marginRight: '10px', marginBottom: '10px' }}>
  <i className="fas fa-save" /> Save
</button>

      </form>
    </div>
    </div>
    </div>
    </div>
  );
};

export default EditAmenities;
