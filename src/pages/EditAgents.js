import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditAgents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userList, setUser] = useState([]);
  const [search, setSearch] = useState('');
  const [agent, setAgent] = useState({
    image: [],
    agent_name: '',
    contact_info: '',
    email: '',
    yearofexperience: '',
    languagespoken: '',
    expertise: '',
    BRN: '',
    description: '',
  });

    useEffect(() => {
    if (search.trim() === '') {
      fetchAgent();
      fetchUser();
    } else {
      searchUser();
    }
  }, [search, id]);

  const fetchAgent = async () => {
    try {
      const agentResponse = await axios.get(`${backendUrl}/api/agent/${id}`);
      setAgent(agentResponse.data);
  
    } catch (error) {
      console.log('Error fetching agent or user:', error);
    }
  };
  
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/${id}`,{ params: {role: 'Agent'}});
      setUser(response.data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  const searchUser = async () => {
    try {
      const params = { search, role: 'Agent' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setUser(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleUserNameChange = (e) => {
    setAgent({ ...agent, agent_name: e.target.value });
  };

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/agent/${id}`, agent);
      navigate('/agents');
    } catch (error) {
      console.log('Error updating agent:', error);
    }
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image') {
      const newImages = Array.from(files);
      setAgent((prevAgent) => ({
        ...prevAgent,
        image: newImages,
      }));
    }
  };

  const handleUserSelect = (user) => {
    setAgent({ ...agent, agent_name: user.first_name + ' ' + user.last_name });
    setSearch('');
  };

  const handleDeleteImage = (event, img) => {
    const updatedImages = agent.image.filter((image) => image !== img);
    setAgent({ ...agent, image: updatedImages });
  };

  return (
    <div className="container-fluid" style={{ marginTop: '60px'}}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card shadow-lg w-50 mt-4">
            <div className="card-header">
              <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Edit Agents
                <button
                  type="submit"
                  className="btn btn-info btn-sm"
                  style={{ marginRight: '10px', marginBottom: '10px' }}
                >
                  <i className="fas fa-save" /> Save
                </button>
              </h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Agent Name</label>
                    <input
  className="form-control"
  value={agent.agent_name || (agent.user ? `${agent.user.first_name} ${agent.user.last_name}` : '')}
  onChange={handleUserNameChange}
  type="text"
  placeholder="Enter Agent Name"
/>

                    {search.trim() !== '' && userList.length > 0 && (
                      <ul
                        className="list-group mt-2"
                        style={{ position: 'absolute', zIndex: 10, width: '100%' }}
                      >
                        {userList.map((user) => (
                          <li
                            key={user._id}
                            className="list-group-item"
                            onClick={() => handleUserSelect(user)}
                            style={{ cursor: 'pointer' }}
                          >
                            {user.first_name} {user.last_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Contact Info</label>
                    <input
                      type="text"
                      name="contact_info"
                      value={agent.contact_info}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={agent.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Year Of Experience</label>
                    <input
                      type="text"
                      name="yearofexperience"
                      value={agent.yearofexperience}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Language Spoken</label>
                    <input
                      type="text"
                      name="languagespoken"
                      value={agent.languagespoken}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Expertise</label>
                    <textarea
                      name="expertise"
                      value={agent.expertise}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>BRN</label>
                    <input
                      type="text"
                      name="BRN"
                      value={agent.BRN}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={agent.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <div className="border p-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      <label>Upload Image:</label>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={handleFileChange}
                        multiple
                      />
                      <div className="mt-3">
  {Array.isArray(agent.image) && agent.image.length > 0 ? (
    <div>
      {agent.image.map((img, index) => (
        <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
          {img && (typeof img === 'string' || img instanceof String) ? (
            <img
              src={`${backendUrl}/${img.replace(/\\/g, '/')}`}
              alt={`Property ${index + 1}`}
              style={{ width: '100px', height: '100px', margin: '10px', display: 'block' }}
            />
          ) : img instanceof File ? (
            <img
              src={URL.createObjectURL(img)}
              alt={`Property ${index + 1}`}
              style={{ width: '100px', height: '100px', margin: '10px', display: 'block' }}
            />
          ) : (
            <span>Invalid Image</span>
          )}
          <button
            onClick={(event) => handleDeleteImage(event, img)}
            style={{
              position: 'absolute',
              margin: '10px',
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
  ) : (
    <span>No Images Uploaded</span>
  )}
</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAgents;
