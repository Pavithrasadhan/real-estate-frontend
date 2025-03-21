import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddAgents = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [agent_name, setAgentName] = useState('');
    const [contact_info, setContactInfo] = useState('');
    const [email, setEmail] = useState('');
    const [yearofexperience, setYearOfExperience] = useState('');
    const [languagespoken, setLanguageSpoken] = useState('');
    const [expertise, setExpertise] = useState('');
    const [BRN, setBRN] = useState('');
    const [description, setDescription] = useState('');
    const [searchName, setSearchName] = useState('');
    const [userList, setUserList] = useState([]);
    const [isManualEntry, setIsManualEntry] = useState(false);

    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        try {
            const [ownersResponse, agentsResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/user`, { params: { role: 'Owner' } }),
                axios.get(`${backendUrl}/api/user`, { params: { role: 'Agent' } }),
            ]);
            const combinedList = [
                ...(ownersResponse.data.users || []),
                ...(agentsResponse.data.users || []),
            ];
            setUserList(combinedList);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users. Please try again.');
        }
    }, [backendUrl]);

    const searchUser = useCallback(async () => {
        try {
            const params = { search: searchName };
            const response = await axios.get(`${backendUrl}/api/search/user`, { params });
            setUserList(response.data.users || []);
        } catch (error) {
            console.error('Error searching users:', error);
            alert('Failed to search users. Please try again.');
        }
    }, [searchName, backendUrl]);

    useEffect(() => {
        if (searchName.trim() === "") {
            fetchUsers();
        } else {
            searchUser();
        }
    }, [searchName, fetchUsers, searchUser]);

    const handleUserSelect = (user) => {
        const fullName = `${user.first_name} ${user.last_name}`;
        setAgentName(fullName);
        setSearchName(fullName);
        setContactInfo(user.contact_info || '');
        setEmail(user.email || '');
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            alert('Please select an image file.');
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Only JPEG, PNG, and GIF images are allowed.');
            return;
        }
        setImage(selectedFile);
        setImagePreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agent_name.trim()) {
            alert('Please enter the agent name.');
            return;
        }
        if (!contact_info.trim()) {
            alert('Please enter the contact information.');
            return;
        }
        if (!email.trim()) {
            alert('Please enter the email.');
            return;
        }
        if (!yearofexperience.trim()) {
            alert('Please enter the years of experience.');
            return;
        }
        if (!languagespoken.trim()) {
            alert('Please enter the languages spoken.');
            return;
        }
        if (!expertise.trim()) {
            alert('Please enter the expertise.');
            return;
        }
        if (!BRN.trim()) {
            alert('Please enter the BRN.');
            return;
        }
        if (!description.trim()) {
            alert('Please enter the description.');
            return;
        }

        const formData = new FormData();
        formData.append('agent_name', agent_name);
        formData.append('contact_info', contact_info);
        formData.append('email', email);
        formData.append('yearofexperience', yearofexperience);
        formData.append('languagespoken', languagespoken);
        formData.append('expertise', expertise);
        formData.append('BRN', BRN);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post(`${backendUrl}/api/agent`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/agents');
        } catch (error) {
            console.error('Error adding agent:', error);
            alert(`Failed to add agent: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleCancel = () => navigate('/agents');

    return (
        <div className="container-fluid" style={{marginTop: "60px"}}>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card shadow-lg w-50 mt-4">
                    <div className="card-header text-center">
                        <h2>Add New Agents</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="imageUpload">Upload Image</label>
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            className="form-control"
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img src={imagePreview} alt="Preview" width="100" height="100" />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => {
                                                        setImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="agentName">Agent/Owner Name</label>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="manualEntry"
                                                checked={isManualEntry}
                                                onChange={(e) => setIsManualEntry(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="manualEntry">
                                                Manually Enter Name
                                            </label>
                                        </div>

                                        {isManualEntry ? (
                                            <input
                                                id="agentName"
                                                type="text"
                                                className="form-control"
                                                value={agent_name}
                                                onChange={(e) => setAgentName(e.target.value)}
                                                placeholder="Enter Agent/Owner Name"
                                            />
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={searchName}
                                                    onChange={(e) => setSearchName(e.target.value)}
                                                    placeholder="Search Agent or Owner"
                                                />
                                                {searchName.trim() !== '' && userList.length > 0 && (
                                                    <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
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
                                            </>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contactInfo">Contact Info</label>
                                        <input
                                            id="contactInfo"
                                            className="form-control"
                                            type="text"
                                            value={contact_info}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            placeholder="Enter Contact Information"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            className="form-control"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter Email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="yearofexperience">Year Of Experience</label>
                                        <input
                                            id="yearofexperience"
                                            className="form-control"
                                            type="text"
                                            value={yearofexperience}
                                            onChange={(e) => setYearOfExperience(e.target.value)}
                                            placeholder="Enter Year of experience"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="languagespoken">Language Spoken</label>
                                        <input
                                            id="languagespoken"
                                            className="form-control"
                                            type="text"
                                            value={languagespoken}
                                            onChange={(e) => setLanguageSpoken(e.target.value)}
                                            placeholder="Enter Language"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="expertise">Expertise</label>
                                        <input
                                            id="expertise"
                                            className="form-control"
                                            type="text"
                                            value={expertise}
                                            onChange={(e) => setExpertise(e.target.value)}
                                            placeholder="Enter Expertise"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="BRN">BRN</label>
                                        <input
                                            id="BRN"
                                            className="form-control"
                                            type="text"
                                            value={BRN}
                                            onChange={(e) => setBRN(e.target.value)}
                                            placeholder="Enter BRN"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            className="form-control form-control-sm"
                                            value={description}
                                            placeholder="Enter Description"
                                            onChange={(e) => setDescription(e.target.value)}
                                            style={{ width: '100%', maxHeight: '200px', minHeight: '100px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <button className="btn btn-success me-2" type="submit">Add Agent</button>
                                <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAgents;
