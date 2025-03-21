import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    image: [], 
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/${id}`);
      const fetchedUser = response.data;
  
      setUser({
        ...fetchedUser,
        image: Array.isArray(fetchedUser.image) ? fetchedUser.image : [],
      });
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image') {
      const newImages = Array.from(files);
      setUser((prevUser) => ({
        ...prevUser,
        image: newImages,
      }));
    }
  };

  const handleDeleteImage = async (event, img) => {
    event.preventDefault();
    try {
      if (typeof img === 'string') {
        const response = await axios.delete(`${backendUrl}/api/user/${id}/image`, {
          params: { imageUrl: img }, 
        });

        if (response.status === 200) {
          setUser((prevState) => ({
            ...prevState,
            image: prevState.image.filter((image) => image !== img),
          }));
        }
      } else {
        setUser((prevState) => ({
          ...prevState,
          image: prevState.image.filter((image) => image !== img),
        }));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', user.first_name);
    formData.append('last_name', user.last_name);
    formData.append('email', user.email);
    formData.append('phone', user.phone);
    formData.append('password', user.password);
    formData.append('role', user.role);
    
    user.image.forEach((img) => {
      if (img instanceof File) {
        formData.append('image', img);
      }
    });

    try {
      await axios.put(`${backendUrl}/api/user/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/user');
    } catch (error) {
      console.log('Error updating user:', error);
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: '60px'}}>
      <div className="card shadow-lg " style={{ width: '50vw'}}>
        
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Edit User</h4>
          <button
            type="submit"
            className="btn btn-info"
            onClick={handleSubmit}
          >
            <i className="fas fa-save" /> Save
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
            
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label>Upload Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    onChange={handleFileChange}
                    multiple
                  />
                  <div className="mt-3">
                    {user.image.length > 0 && (
                      <div>
                        {user.image.map((img, index) => (
                          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                            {typeof img === 'string' ? (
                              <img
                                src={`${backendUrl}/${img.replace(/\\/g, '/')}`}
                                alt={`user ${index + 1}`}
                                style={{ width: '100px', height: '100px', margin: '10px' }}
                              />
                            ) : img instanceof File ? (
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`user ${index + 1}`}
                                style={{ width: '100px', height: '100px', margin: '10px' }}
                              />
                            ) : (
                              <span>Invalid Image</span>
                            )}
                            <button
                              onClick={(event) => handleDeleteImage(event, img)}
                              style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                fontSize: '12px',
                                padding: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="first_name" value={user.first_name} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="last_name" value={user.last_name} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={user.email} onChange={handleChange} className="form-control" />
                </div>
                </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" name="phone" value={user.phone} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={user.password} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={user.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="Owner">Owner</option>
                    <option value="Agent">Agent</option>
                    <option value="Buyer">Buyer</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
