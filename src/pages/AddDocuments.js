import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AddDocuments = () => {
  const [property_name, setPropertyName] = useState('');
  const [document_name, setDocumentName] = useState('');
  const [document_type, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [propertyList, setPropertyList] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim() === "") {
      fetchProperties();
    } else {
      searchProperties();
    }
  }, [search]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to fetch properties. Please try again.");
    }
  };

  const searchProperties = async () => {
    try {
      const params = { search };
      const response = await axios.get(`${backendUrl}/api/search/properties`, { params });
      setPropertyList(response.data.properties || []);
      setError(response.data.properties.length === 0 ? 'Property not found' : '');
    } catch (error) {
      console.error('Error searching properties:', error);
      setError('Failed to search properties. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPropertyName(value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!property_name || !document_name || !document_type || !file) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('property_name', property_name);
    formData.append('document_name', document_name);
    formData.append('document_type', document_type);
    formData.append('documentFile', file);

    axios.post(`${backendUrl}/api/documents`, formData)
      .then((response) => {
        console.log(response.data);
        setPropertyName('');
        setDocumentName('');
        setDocumentType('');
        setFile(null);
        navigate('/documents');
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to add document. Please try again.');
      });
  };

  const handleCancel = () => {
    setPropertyName('');
    setDocumentName('');
    setDocumentType('');
    setFile(null);
    navigate('/documents');
  };

  const handleDocumentSelect = (propertyName) => {
    setPropertyName(propertyName);
    setSearch('');
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card shadow-lg w-50 mt-4">
            <div className="card-header text-center">
              <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Add New Document
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Add Document</button>
                  <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
                </div>
              </h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Property Name</label>
                <input
                  className="form-control"
                  value={property_name}
                  onChange={handleSearchChange}
                  type="text"
                  placeholder="Enter Property Name"
                />
                {search.trim() !== '' && propertyList.length > 0 && (
                  <ul className="list-group mt-2" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                    {propertyList.map((property) => (
                      <li
                        key={property._id}
                        className="list-group-item"
                        onClick={() => handleDocumentSelect(property.name)}
                        style={{ cursor: "pointer" }}
                      >
                        {property.name}
                      </li>
                    ))}
                  </ul>
                )}
                {error && <div className="text-danger">{error}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="documentName">Document Name</label>
                <input
                  id="documentName"
                  className="form-control"
                  type="text"
                  value={document_name}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter Document Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="documentType">Document Type</label>
                <input
                  id="documentType"
                  className="form-control"
                  type="text"
                  value={document_type}
                  onChange={(e) => setDocumentType(e.target.value)}
                  placeholder="Enter Document Type"
                />
              </div>
              <div className="form-group">
                <label htmlFor="documentFile">Upload Document</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDocuments;
