import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewDocuments = () => {
  const { property_name } = useParams();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [property_name]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/documents/property/${property_name}`);
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching documents:', error);
      setError("Error fetching document details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  if (!Array.isArray(documents) || documents.length === 0) {
    return <div className='text-center mt-5'>Documents not found!</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className='card shadow-lg p-4 rounded' style={{ width: '400px' }}>
          <div className='card-body text-center'>
            <h5 className='card-header mb-3' style={{ fontWeight: 'bold' }}>
              {documents.length > 0 ? documents[0].property_name : 'Documents'}
            </h5>
            <div className='text-start'>
              {documents.map((document, index) => (
                <div key={document._id || index}>
                  <p><strong>Document Name:</strong> {document.document_name}</p>
                  <p><strong>Document Type:</strong> {document.document_type}</p>
                  <p><strong>Document File:</strong>
                    {document.document_path ? (
                      <a
                        href={`${backendUrl}/${document.document_path.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View / Download Document
                      </a>
                    ) : (
                      "No Document Available"
                    )}
                  </p>
                </div>
              ))}
            </div>
            <Link
              to={`/documents/editdocuments/${property_name}`}
              className="btn btn-primary"
              style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}
            >
              Edit Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocuments;
