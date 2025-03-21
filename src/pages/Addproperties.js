import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddProperties = () => {
  const { id } = useParams();
  const [owner_name, setOwnerName] = useState('');
  const [agent_name, setAgentName] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [image, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqft, setSqft] = useState('');
  const [location, setLocation] = useState('');
  const [furnished, setFurnished] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [availablefrom, setAvailableFrom] = useState('');
  const [addedDate, setAddedDate] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [yearofcompletion, setYearOfCompletion] = useState('');
  const [floors, setFloors] = useState('');
  const [permitNo, setPermitNo] = useState('');
  const [DED, setDED] = useState('');
  const [RERA, setRERA] = useState('');
  const [BRN, setBRN] = useState('');
  const [RefId, setRefId] = useState('');
  const [QRcode, setQRcode] = useState(null);
  const [QRcodePreview, setQRcodePreview] = useState(null);
  const [visibility, setVisibility] = useState('');
  const [base_price, setBasePrice] = useState('');
  const [status, setStatus] = useState('');
  const [ownerList, setOwnerList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [searchuser, setSearch] = useState('');
  const [searchagent, setsearchAgent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAmenitiesList();
  }, []);

  useEffect(() => {
    if (searchuser.trim() === '') {
      fetchOwnerList();
    } else {
      searchUser();
    }

    if (searchagent.trim() === '') {
      fetchAgentList();
    } else {
      searchAgent();
    }
  }, [id, searchuser, searchagent]);

  const fetchAmenitiesList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/amenities`);
      setAmenitiesList(response.data.amenities || []);
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
      const params = { search: searchuser, role: 'Owner' };
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

  const handleDateChange = (setter) => (e) => {
    const selectedDate = e.target.value;
    setter(selectedDate);
  };

  const handleUserNameChange = (e) => {
    setSearch(e.target.value);  
    setOwnerName(e.target.value);
  };

  const handleAgentNameChange = (e) => {
    setsearchAgent(e.target.value);
    setAgentName(e.target.value);
  };

  const handleUserSelect = (user) => {
    setOwnerName(user.first_name + " " + user.last_name);
    setSearch('');
  };
  
  const handleAgentSelect = (user) => {
    setAgentName(user.first_name + " " + user.last_name);
    setsearchAgent('');
  };
  
  const handleAmenitiesChange = (e) => {
    const amenityName = e.target.getAttribute('data-name');
    setSelectedAmenities((prevState) => {
      if (prevState.includes(amenityName)) {
        return prevState.filter((name) => name !== amenityName);
      } else {
        return [...prevState, amenityName];
      }
    });
  };
  
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );
  
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
      alert(`The following files are not allowed: ${invalidFileNames}. Only JPEG, PNG, and GIF images are allowed.`);
      return;
    }
  
    const MAX_IMAGES = 20;
    if (image.length + selectedFiles.length > MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }
  
    const uniqueFiles = selectedFiles.filter((file) => {
      const fileIdentifier = `${file.name}-${file.size}`;
      return !image.some(
        (existingFile) =>
          `${existingFile.name}-${existingFile.size}` === fileIdentifier
      );
    });
  
    if (uniqueFiles.length > 0) {
      setImages((prevImages) => [...prevImages, ...uniqueFiles]);
  
      const newPreviews = uniqueFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  
      e.target.value = '';
    } else {
      alert(`All ${selectedFiles.length} files were duplicates and were not added.`);
    }
  };

  const handleQRImageChange = (e) => {
    const file = e.target.files[0];
    setQRcode(file);
    setQRcodePreview(URL.createObjectURL(file));
  };

    const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('owner_name', owner_name);
  formData.append('agent_name', agent_name);
  formData.append('name', name);
  formData.append('description', description);
  formData.append('type', type);
  formData.append('purpose', purpose);
  formData.append('beds', beds);
  formData.append('baths', baths);
  formData.append('sqft', sqft);
  formData.append('location', location);
  formData.append('furnished', furnished);
  formData.append('mapLink', mapLink);
  formData.append('availableFrom', availablefrom);
  formData.append('addedDate', addedDate);
  formData.append('buildingName', buildingName);
  formData.append('yearOfCompletion', yearofcompletion);
  formData.append('floors', floors);
  formData.append('permitNo', permitNo);
  formData.append('DED', DED);
  formData.append('RERA', RERA);
  formData.append('BRN', BRN);
  formData.append('RefId', RefId);
  formData.append('visibility', visibility);
  formData.append('base_price', base_price);
  formData.append('status', status);

  selectedAmenities.forEach((amenity) => {
    formData.append('amenities[]', amenity);
  });

  image.forEach(file => {
    formData.append('image', file);
  });

  axios.post(`${backendUrl}/api/properties`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then((response) => {
    console.log('Response:', response.data);
    resetForm();
    navigate('/properties');
  })
  .catch((error) => {
    console.error('Error adding property:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    alert('An error occurred while adding the property.');
  });
};
  
  const handleCancel = () => {
    resetForm();
    navigate('/properties');
  };

  const resetForm = () => {
    setOwnerName('');
    setAgentName('');
    setImages([]);
    setImagePreviews([]);
    setName('');
    setDescription('');
    setType('');
    setPurpose('');
    setSelectedAmenities([]);
    setBeds('');
    setBaths('');
    setSqft('');
    setLocation('');
    setFurnished('');
    setMapLink('');
    setAvailableFrom('');
    setAddedDate('');
    setBuildingName('');
    setYearOfCompletion('');
    setFloors('');
    setPermitNo('');
    setDED('');
    setRERA('');
    setBRN('');
    setRefId('');
    setQRcode(null);
    setQRcodePreview(null);
    setVisibility('');
    setBasePrice('');
    setStatus('');
  };
  const handleImageClick = (index) => {
    const newImagePreviews = [...imagePreviews];
    const newImage = document.createElement('input');
    newImage.type = 'file';
    newImage.accept = 'image/*';

    newImage.click();
    newImage.onchange = (e) => {
      const file = e.target.files[0];
      const newFilePreview = URL.createObjectURL(file);
      newImagePreviews[index] = newFilePreview; 
      setImagePreviews(newImagePreviews);

      const newFiles = [...image];
      newFiles[index] = file;
      setImages(newFiles); 
    };
  };

  const handleImageDelete = (index) => {
    const newImagePreviews = [...imagePreviews];
    const newImages = [...image];

    newImagePreviews.splice(index, 1);
    newImages.splice(index, 1); 

    setImagePreviews(newImagePreviews);
    setImages(newImages);
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
  
  <form onSubmit={handleSubmit}>
  <h4 style={{marginLeft: '800px'}}>
                <button type="submit" className="btn btn-success" style={{marginRight: '30px'}}>Add Property</button>
                <button type="button" className="btn btn-danger" onClick={handleCancel} >Cancel</button>
              </h4>
          <div className="row">
              
              <div className="col-md-4">
              <div className='form-group'>
  <label>Owner Name</label>
  <input
    type='text'
    className="form-control"
    value={owner_name}
    onChange={handleUserNameChange}
  />
  {searchuser.trim() !== '' && ownerList.length > 0 && (
    <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
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

<div className='form-group'>
  <label>Agent Name</label>
  <input
    type='text'
    className="form-control"
    value={agent_name}
    onChange={handleAgentNameChange}
  />
  {searchagent.trim() !== '' && agentList.length > 0 && (
    <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
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
                <label>Name</label>
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={name}
                  placeholder="Enter Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control form-control-sm"
                  value={description}
                  placeholder="Enter Description"
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                  width: '100%',
                  maxHeight: '200px',
                 minHeight: '100px'}}
                />
              </div>

              <div className="form-group row">
  <div className="col-md-4">
    <label>Type</label>
    <input
      className="form-control form-control-sm"
      type="text"
      value={type}
      placeholder="Enter Type"
      onChange={(e) => setType(e.target.value)}
    />
  </div>

  <div className="col-md-4">
    <label>Purpose</label>
    <input
      className="form-control form-control-sm"
      type="text"
      value={purpose}
      placeholder="Enter Purpose"
      onChange={(e) => setPurpose(e.target.value)}
    />
  </div>
  <div className="col-md-4">
                <label>Base Price</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={base_price}
                  placeholder="Enter Base Price"
                  onChange={(e) => setBasePrice(e.target.value)}
                />
              </div>

</div>
</div>
<div className='col-md-4'>
<div className="form-group">
  <div className="border p-3">
    <label>Amenities</label>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        maxHeight: '100px',
        overflowY: 'auto',
      }}
    >
      {amenitiesList?.map((amenity) => (
        <div key={amenity._id} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            value={amenity.name}
            data-name={amenity.name}
            checked={selectedAmenities.includes(amenity.name)}
            onChange={handleAmenitiesChange}
          />
          <label className="form-check-label">{amenity.name}</label>
        </div>
      ))}
    </div>
  </div>
</div>

    <div className="form-group d-flex justify-content-between">
  <div className="col-md-4">
    <label>Beds</label>
    <input
      className="form-control form-control-sm"
      type="text"
      value={beds}
      placeholder="Enter No of Beds"
      onChange={(e) => setBeds(e.target.value)}
    />
  </div>

  <div className="col-md-4">
    <label>Baths</label>
    <input
      className="form-control form-control-sm"
      type="text"
      value={baths}
      placeholder="Enter No of Baths"
      onChange={(e) => setBaths(e.target.value)}
    />
  </div>

  <div className="col-md-4">
    <label>Sqft</label>
    <input
      className="form-control form-control-sm"
      type="text"
      value={sqft}
      placeholder="Enter Sqft"
      onChange={(e) => setSqft(e.target.value)}
    />
  </div>
</div>
<div className="col-md-4">
                <label>Furnished</label>
                <select
                  className="form-select"
                  value={furnished}
                  onChange={(e) => setFurnished(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Furnished">Yes</option>
                  <option value="Unfurnished">No</option>
                </select>
              </div>

            <div className='form-group row'>
              <div className="col-md-6">
                <label>Location</label>
                <input
                  className="form-control form-control-sm"
                  type="text"
                  value={location}
                  placeholder="Enter Location"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              
              <div className="col-md-6">
                <label>Map Link</label>
                <input
                  className="form-control form-control-sm"
                  type="url"
                  value={mapLink}
                  placeholder="Enter Map Link"
                  onChange={(e) => setMapLink(e.target.value)}
                />
              </div>
              </div>
              </div>
              <div className="col-md-4">
  <div className="form-group">
    <div className="border p-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
      <label>Upload Images</label>
      <input
        type="file"
        className="form-control"
        name="image"
        multiple
        onChange={handleImageChange}
      />
      <div className="mt-3">
        {imagePreviews.length > 0 && (
          <div className="d-flex flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="position-relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  width="100"
                  height="100"
                  className="me-2 mb-2"
                  onClick={() => handleImageClick(index)}
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
                  onClick={() => handleImageDelete(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>                  
              <div className="form-group">
                <div className='border p-3'>
                <div className="row">
                  <div className='col-md-4'>
                    <div className='form-group row'>
                      <div className='col-md-6'>
                <label>Available From</label>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  value={availablefrom}
                  onChange={handleDateChange(setAvailableFrom)}
                />
              </div>
              
             
              <div className="col-md-6">
                <label>Added Date</label>
                <input
                  className="form-control form-control-sm"
                  type="date"
                  value={addedDate}
                  onChange={handleDateChange(setAddedDate)}
                />
              </div>
              </div>
              
              <div className='row'>
                <div className='col-md-6'>
              <div className="form-group">
              <label>Visibility</label>
      <div className="form-check">
        <input 
          className="form-check-input" 
          type="radio" 
          value="Private" 
          checked={visibility === 'Private'} 
          onChange={(e) => setVisibility(e.target.value)} 
        />
        <label className="form-check-label">Private</label>
      </div>
      <div className="form-check">
        <input 
          className="form-check-input" 
          type="radio" 
          value="Public" 
          checked={visibility === 'Public'} 
          onChange={(e) => setVisibility(e.target.value)} 
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
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
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
        <label>Building Name</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={buildingName}
          placeholder="Enter Building Name"
          onChange={(e) => setBuildingName(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label>Year of Completion</label>
        <input
          className="form-control form-control-sm"
          type="number"
          value={yearofcompletion}
          placeholder="Enter Year of Completion"
          onChange={(e) => setYearOfCompletion(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label>No of Floors</label>
        <input
          className="form-control form-control-sm"
          type="number"
          value={floors}
          placeholder="Enter No of Floors"
          onChange={(e) => setFloors(e.target.value)}
        />
      </div>
    </div>
  </div>

<div className="col-md-4">
  <div className="row">
      <div className="col-md-4">
        <label>Permit No</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={permitNo}
          placeholder="Enter Permit No"
          onChange={(e) => setPermitNo(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label>DED</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={DED}
          placeholder="Enter DED"
          onChange={(e) => setDED(e.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label>RERA</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={RERA}
          placeholder="Enter RERA"
          onChange={(e) => setRERA(e.target.value)}
        />
      </div>
</div>
      <div className="row mt-3">
        <div className='col-md-4'>
        <label>BRN</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={BRN}
          placeholder="Enter BRN"
          onChange={(e) => setBRN(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <label>RefId</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={RefId}
          placeholder="Enter RefId"
          onChange={(e) => setRefId(e.target.value)}
        />
      </div>
            
              <div className="form-group">
                <label>Upload QR Code</label>
                <input
                  type="file"
                  className="form-control"
                  name="QRcode"
                  onChange={handleQRImageChange}
                />
                {QRcodePreview && <img src={QRcodePreview} alt="QR Code Preview" width="100" height="100" />}
            
            </div>
              </div></div></div>
              </div>
              </div>
    </div> 
            </form>
          </div>
  
  );
};

export default AddProperties;
