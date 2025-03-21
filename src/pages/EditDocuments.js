import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditDocument = () => {
  const { property_name } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    property_name: "",
    document_name: "",
    document_type: "",
    document_path: "",
  });
  const [propertyList, setPropertyList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDocument();
  }, []);

  useEffect(() => {
    if (search.trim() !== '') {
      fetchPropertyList();
     
    } else {
      searchProperties();
    }
  }, [search]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/documents/property/${property_name}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setDocument(response.data[0]);
      } else {
        console.log("No document found for this property.");
      }
    } catch (error) {
      console.log("Error fetching document:", error);
    }
  };

  const fetchPropertyList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties`);
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
  };

  const searchProperties = async () => {
    try {
      const params = { search: search };
      const response = await axios.get(`${backendUrl}/api/search/properties`, { params });
      setPropertyList(response.data.properties || []);
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  };

  const handleUserNameChange = (e) => {
    setDocument({ ...document, property_name: e.target.value }); 
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    setDocument({ ...document, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setDocument({ ...document, document_file: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("property_name", document.property_name);
    formData.append("document_name", document.document_name);
    formData.append("document_type", document.document_type);
    if (document.document_file) {
      formData.append("document_file", document.document_file);
    }

    try {
      await axios.put(`${backendUrl}/api/documents/property/${property_name}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/documents");
    } catch (error) {
      console.log("Error updating document:", error.response ? error.response.data : error.message);
    }
  };

  const handleUserSelect = (property) => {
    setDocument((prevState) => ({
      ...prevState,
      property_name: property.name,
    }));
    setSearch('');
  };

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card shadow-lg w-50 mt-4">
            <div className="card-header">
              <h2 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Edit Document
                <button type="submit" className="btn btn-primary">
                  Update Document
                </button>
              </h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Property Name</label>
                <input
                  className="form-control"
                  value={document.property_name}
                  onChange={handleUserNameChange}
                  type="text"
                  placeholder="Enter Property Name"
                />
                {search.trim() !== '' && propertyList.length > 0 && (
                  <ul
                    className="list-group mt-2"
                    style={{ position: 'absolute', zIndex: 10, width: '100%' }}
                  >
                    {propertyList.map((property) => (
                      <li
                        key={property._id}
                        className="list-group-item"
                        onClick={() => handleUserSelect(property)}
                        style={{ cursor: 'pointer' }}
                      >
                        {property.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Document Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="document_name"
                  value={document.document_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Document Type:</label>
                <input
                  type="text"
                  className="form-control"
                  name="document_type"
                  value={document.document_type}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Upload Document:</label>
                <input
                  type="file"
                  className="form-control"
                  name="document_file"
                  onChange={handleFileChange}
                />
              </div>

              <div className="form-group">
                <label>Document Preview:</label>
                {document.document_path && (
                  <iframe
                    src={`${backendUrl}/${document.document_path.replace(/\\/g, '/')}`}
                    width="100%"
                    height="150"
                    title="Document Preview"
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDocument;
