import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddUser = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      alert('Only JPEG, PNG, and GIF images are allowed.');
      return;
    }

    setImage(selectedFile); 
    const preview = URL.createObjectURL(selectedFile); 
    setImagePreview(preview); 
  };

  const changeRoleHandler = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('role', role);

    if (image) {
      formData.append('image', image); 
    }

    axios.post(`${backendUrl}/api/user/register`, formData)
      .then((response) => {
        console.log(response.data);
        setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('');
    navigate('/user');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRole('');
    navigate('/user');
  };

  return (
    <div className="container-fluid" style={{marginTop: "60px"}}>
    <div className="d-flex justify-content-center">
    <form onSubmit={handleSubmit}>
      <div className="card shadow-lg w-100 ">
        <div className="card-header text-center">
          <h2>Add New User
          <div className="d-flex justify-content-between">
              <button className="btn btn-primary" type="submit">Add User</button>
              <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </h2>
          </div>
          <div className="card-body">
         <div className='row'>
          <div className='col-md-6'>
          <div className="mb-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      <label>Upload Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            width="100"
                            height="100"
                            className="me-2 mb-2"
                          />
                          <button
                            type="button"
                            className="btn btn-danger position-absolute"
                            style={{
                              top: '0',
                              right: '0',
                              fontSize: '12px',
                              padding: '2px 5px',
                            }}
                            onClick={() => {
                              setImage(null);  
                              setImagePreview(null);  
                            }}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>
            <div className="form-group">
              <label>First Name:</label>
              <input
                className="form-control   "
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Enter First Name'
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                className="form-control"
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Enter Last Name'
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter Email'
              />
            </div>
                    </div>
                    <div className='col-md-6'>
                                  <div className="form-group">
              <label>Phone:</label>
              <input
                className="form-control"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Enter Phone Number'
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Password'
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select
                className="form-select"
                aria-label="Select Role"
                onChange={changeRoleHandler}
              >
                <option value="">Select Role</option>
                <option value="Owner">Owner</option>
                <option value="Agent">Agent</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>

            </div>
            </div>
         
        </div>
      </div>
      </form>
    </div>
    </div>
  
  );
};

export default AddUser;
