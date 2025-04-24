import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditProperties = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchagent, setSearchAgent] = useState('');
  const [search, setSearch] = useState('');

  const [properties, setProperties] = useState({
    owner_name: '', image: [], name: '', description: '', type: '', purpose: '', amenities: [], beds: '', baths: '', sqft: '', location: '', furnished: '', mapLink: '', availablefrom: '', addedDate: '', buildingName: '', yearofcompletion: '', floors: '', permitNo: '', DED: '', RERA: '', BRN: '', RefId: '', QRcode: null, visibility: '', base_price: '', status: '',
  });

  useEffect(() => {
    fetchProperties();
    fetchAmenitiesList();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      fetchOwnerList();
    } else {
      searchUser();
    }

    if (searchagent.trim() === '') {
      fetchAgentList();
    } else {
      searchAgent();
    }
  }, [search, searchagent]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties/${id}`);
      setProperties(response.data);
      setSelectedAmenities(response.data.amenities || []);
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
  };

  const fetchAmenitiesList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/amenities`);
      setAmenitiesList(response.data.amenities);
    } catch (error) {
      console.log('Error fetching amenities:', error);
    }
  };

  const fetchOwnerList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Owner' }
      });
      setOwnerList(response.data);
    } catch (error) {
      console.log('Error fetching owners:', error);
    }
  };

  const fetchAgentList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user`, {
        params: { role: 'Agent' }
      });
      setAgentList(response.data);
    } catch (error) {
      console.log('Error fetching agents:', error);
    }
  };

  const searchUser = async () => {
    try {
      const params = { search: search, role: 'Owner' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setOwnerList(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const searchAgent = async () => {
    try {
      const params = { search: searchagent, role: 'Agent' };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setAgentList(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setProperties({ ...properties, [name]: checked });
    } else if (type === 'radio') {
      setProperties({ ...properties, [name]: value });
    } else {
      setProperties({ ...properties, [name]: value });
    }
  };

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === '') {
      setProperties(prevProperties => ({
        ...prevProperties,
        owner_name: ''
      }));
    }
    setOwnerList([]);
  };

  const handleAgentNameChange = (e) => {
    const value = e.target.value;
    setSearchAgent(value);
    if (value.trim() === '') {
      setProperties(prevProperties => ({
        ...prevProperties,
        agent_name: ''
      }));
    }
    setAgentList([]);
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'image') {
      const newImages = Array.from(files);
      setProperties((prevProperties) => ({
        ...prevProperties,
        image: [...prevProperties.image, ...newImages.filter(
          (newImage) => !prevProperties.image.some(
            (existingImage) => existingImage.name === newImage.name && existingImage.size === newImage.size
          )
        )],
      }));
    } else if (name === 'QRcode') {
      setProperties((prevProperties) => ({
        ...prevProperties,
        QRcode: files[0] || null,
      }));
    }
  };

  const handleDeleteImage = async (event, img) => {
    event.preventDefault();

    if (typeof img === "string") {
      try {
        const response = await axios.delete(`${backendUrl}/api/properties/${id}/image`, {
          data: { imageUrl: img }
        });

        if (response.status === 200) {
          setProperties((prevState) => ({
            ...prevState,
            image: prevState.image.filter((image) => image !== img),
          }));
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    } else {
      setProperties((prevState) => ({
        ...prevState,
        image: prevState.image.filter((image) => image !== img),
      }));
    }
  };

  const qrCodeSrc = properties.QRcode
    ? properties.QRcode instanceof File
      ? URL.createObjectURL(properties.QRcode)
      : `${backendUrl}/upload/${properties.QRcode.replace(/\\/g, '/')}` 
    : ''; 

  const handleDeleteQRCode = () => {
    setProperties((prevProperties) => ({
      ...prevProperties,
      QRcode: null, 
    }));
  };

  const handleAmenityChange = (amenityName) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityName)) {
        return prev.filter((name) => name !== amenityName);
      } else {
        return [...prev, amenityName]; 
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    Object.entries(properties).forEach(([key, value]) => {
      if (key === 'image') {
        
        properties.image.forEach((file) => {
          if (file instanceof File) {
            formData.append('image', file);
          }
        });
      } else if (key === 'QRcode' && properties.QRcode) {
      
        formData.append('QRcode', properties.QRcode);
      } else {
    
        formData.append(key, value);
      }
    });
  
    formData.append('amenities', JSON.stringify(selectedAmenities));
  
    try {
      const response = await axios.put(`${backendUrl}/api/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      resetForm();
      navigate('/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('An error occurred while updating the property.');
    }
  };
  
  const resetForm = () => {
    setProperties({
      owner_name: '', image: [], name: '', description: '', type: '', purpose: '', amenities: [], beds: '', baths: '', sqft: '', location: '', furnished: '', mapLink: '', availablefrom: '', addedDate: '', buildingName: '', yearofcompletion: '', floors: '', permitNo: '', DED: '', RERA: '', BRN: '', RefId: '', QRcode: null, visibility: '', base_price: '', status: '',
    });
    setSelectedAmenities([]);
  };

  const handleUserSelect = (user) => {
    setProperties({ ...properties, owner_name: user.first_name + ' ' + user.last_name });
    setSearch('');
    setOwnerList([]);
  };

  const handleAgentSelect = (user) => {
    setProperties({ ...properties, agent_name: user.first_name + ' ' + user.last_name });
    setSearchAgent('');
    setAgentList([]);
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginTop: "70px", marginLeft: '900px' }}>
          <button type="submit" className="btn btn-primary">Update Properties</button>
        </h2>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Owner Name</label>
              <input
                className="form-control"
                value={search || properties.owner_name}
                onChange={handleUserNameChange}
                type="text"
                placeholder="Enter Owner Name"
              />
              {search.trim() !== '' && ownerList.length > 0 && (
                <ul
                  className="list-group mt-2"
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                  }}
                >
                  {ownerList.map((user) => (
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
              <label>Agent Name</label>
              <input
                className="form-control"
                value={searchagent || properties.agent_name}
                onChange={handleAgentNameChange}
                type="text"
                placeholder="Enter Agent Name"
              />
              {searchagent.trim() !== '' && agentList.length > 0 && (
                <ul
                  className="list-group mt-2"
                  style={{
                    position: 'absolute',
                    zIndex: 10,
                    width: '100%',
                  }}
                >
                  {agentList.map((user) => (
                    <li
                      key={user._id}
                      className="list-group-item"
                      onClick={() => handleAgentSelect(user)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.first_name} {user.last_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>


        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={properties.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={properties.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group row">
  <div className="col-md-4">
    <label>Type</label>
    <input
      type="text"
      className="form-control"
      name="type"
      value={properties.type}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Purpose</label>
    <input
      type="text"
      className="form-control"
      name="purpose"
      value={properties.purpose}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
          <label>Base Price:</label>
          <input
            type="text"
            className="form-control"
            name="base_price"
            value={properties.base_price}
            onChange={handleChange}
          />
        </div>
        </div>
</div>

<div className="col-md-4">
  <div className="form-group">
    <div className="border p-3">
      <label>Amenities</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", maxHeight: "100px", overflowY: "auto" }}>
  {Array.isArray(amenitiesList) && amenitiesList.map((amenity) => (
    <div key={amenity._id} className="form-check">
      <input
        type="checkbox"
        name="amenities"
        value={amenity.name}
        checked={selectedAmenities.includes(amenity.name)}
        onChange={() => handleAmenityChange(amenity.name)}
        className="form-check-input"
      />
      <label className="form-check-label">
        {amenity.name}
      </label>
    </div>
  ))}
</div>
 </div>
  </div>

     <div className="form-group d-flex justify-content-between">
  <div className="col-md-4">
    <label>Beds</label>
    <input
      type="number"
      className="form-control form-control-sm"
      name="beds"
      value={properties.beds}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Baths:</label>
    <input
      type="number"
      className="form-control form-control-sm"
      name="baths"
      value={properties.baths}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Sqft:</label>
    <input
      type="text"
      className="form-control form-control-sm"
      name="sqft"
      value={properties.sqft}
      onChange={handleChange}
    />
  </div>
  </div>

  <div className="col-md-4">
          <label>Furnished</label>
          <select
            className="form-select form-control-sm"
            name="furnished"
            value={properties.furnished}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Furnished">Yes</option>
            <option value="Unfurnished">No</option>
          </select>
        </div>
      
<div className='form-group row'>
<div className="col-md-6">
          <label>Location:</label>
          <textarea
            className="form-control"
            name="location"
            value={properties.location}
            onChange={handleChange}
          />
        </div>

         <div className="col-md-6">
          <label>Map Link</label>
          <input
            type="url"
            className="form-control"
            name="mapLink"
            value={properties.mapLink}
            onChange={handleChange}
          />
        </div>
        </div>
  </div>

  <div className="col-md-4">
  <div className="form-group">
    <div className="border p-3" style={{ maxHeight: '350px', overflowY: 'auto'}}>
  <label>Upload Image:</label>
  <input
    type="file"
    className="form-control"
    name="image"
    onChange={handleFileChange}
    multiple
  />
  <div className="mt-3">
  {properties.image.length > 0 && (
  <div>
    {properties.image.map((img, index) => (
      <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
        {img && (typeof img === 'string' || img instanceof String) ? (
          <img
            src={`${backendUrl}/upload/${img.replace(/\\/g, '/')}`}
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
)}
</div></div>
</div></div>

        <div className="form-group">
          <div className="border p-3">
            <div className="row">
  <div className="col-md-4">
    <div className="for-group row">
      <div className="col-md-6">
    <label>Available From</label>
    <input
      type="date"
      className="form-control"
      name="availablefrom"
      value={properties.availablefrom}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label>Added Date:</label>
    <input
      type="date"
      className="form-control"
      name="addedDate"
      value={properties.addedDate}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row">
  <div className="col-md-6">
<div className="form-group">
          <label>Visibility</label>
          <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="Private"
            checked={properties.visibility === 'Private'}
            value={properties.visibility}
            onChange={handleChange}
          />
            <label className="form-check-label">Private</label>
            </div>
            <div className="form-check">
            <input
            className="form-check-input"
            type="radio"
            name="Public"
            checked={properties.visibility === 'Public'}
            value={properties.visibility}
            onChange={handleChange}
          />
            <label className="form-check-label">Public</label>
          </div>
          </div>
            </div>

          <div className="col-md-6">
        <div className="form-group">
          <label>Status</label>
          <select
            className="form-select"
            name="status"
            value={properties.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="Under management">Under management</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
       </div>
       </div>
       </div>

<div className="col-md-4">
  <div className="row">
  <div className="col-md-4">
    <label>Building Name:</label>
    <input
      type="text"
      className="form-control"
      name="buildingName"
      value={properties.buildingName}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Year of Completion:</label>
    <input
      type="text"
      className="form-control"
      name="yearofcompletion"
      value={properties.yearofcompletion}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>Floors:</label>
    <input
      type="text"
      className="form-control"
      name="floors"
      value={properties.floors}
      onChange={handleChange}
    />
  </div>
</div>
</div>

  <div className="col-md-4">
    <div className="row">
  <div className="col-md-4">
    <label>Permit No:</label>
    <input
      type="text"
      className="form-control"
      name="permitNo"
      value={properties.permitNo}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
    <label>DED:</label>
    <input
      type="text"
      className="form-control"
      name="DED"
      value={properties.DED}
      onChange={handleChange}
    />
  </div>
              
  <div className="col-md-4">
    <label>RERA:</label>
    <input
      type="text"
      className="form-control"
      name="RERA"
      value={properties.RERA}
      onChange={handleChange}
    />
  </div>
  </div>

  <div className="row mt-3">
  <div className="col-md-4">
    <label>BRN:</label>
    <input
      type="text"
      className="form-control"
      name="BRN"
      value={properties.BRN}
      onChange={handleChange}
    />
  </div>
 
  <div className="col-md-4">
    <label>Ref Id:</label>
    <input
      type="text"
      className="form-control form-control-sm"
      name="RefId"
      value={properties.RefId}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>QR Code</label>
    <input
      type="file"
      className="form-control"
      name="QRcode"
      onChange={handleFileChange}
    />
    {properties.QRcode && (
      <div style={{ position: 'relative', display: 'inline-block'}}>
        <img
          src={qrCodeSrc}
          alt="QR Code"
          style={{ width: '100px', margin: '10px' }}
        />
        <button
          onClick={handleDeleteQRCode}
          style={{
            position: 'absolute',
            margin: '10px',
            top: '0',
            right: '0',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            fontSize: '8px',
            padding: '5px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    )}
  </div>
</div>
</div>
</div>
        </div>
        </div></div>
        
         </form>
    </div>

  );
};

export default EditProperties;
