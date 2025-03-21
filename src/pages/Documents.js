import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Pagination, setPagination] = useState({
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
    });
  
    useEffect(() => {
      if (searchTerm.trim() === ''){
        fetchDocuments();
      }else{
      searchDocuments();
      }
    }, [Pagination.page, searchTerm]);
  
  const fetchDocuments = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { page, limit };

      const response = await axios.get(`${backendUrl}/api/documents`, { params });
      setDocuments(response.data.documents || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.log("Error fetching documents");
    }
  };

  const searchDocuments = async () => {
    try {
      const params = { search: searchTerm };
      const response = await axios.get(`${backendUrl}/api/search/documents`, { params });
      setDocuments(response.data.documents || []);
      setPagination({
        ...Pagination,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      });
    } catch (error) {
      console.error('Error searching documents:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const deleteDocuments = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/documents/${id}`);
      fetchDocuments(); 
    } catch (err) {
      console.log("Error deleting document:", err);
    }
  };

  return (
    <div className="container-fluid" >
      <div className="content-header" style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
          <h3 style={{ margin: "0" }}>Documents List:</h3>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search Documents"
                  aria-label="Search"
                  style={{ borderRadius: "20px", width: "300px" }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="input-group-append">
                  <button className="btn btn-sidebar">
                    <i className="fas fa-search fa-fw" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Link to="/documents/adddocuments" className="btn btn-primary btn-sm" style={{ borderRadius: "20px" }}>
            <i className="fas fa-plus" style={{color: 'white'}}/> Add Document
          </Link>
        </div>
      </div>

      <table className="table" style={{ marginTop: "5px", borderCollapse: "separate", width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: "15px" }}>No</th>
            <th style={{padding: "15px"}}>Property Name</th>
            <th style={{ padding: "15px" }}>Document Name</th>
            <th style={{ padding: "15px" }}>Document Type</th>
            <th style={{ padding: "15px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d, index) => (
            <tr key={d._id}>
              <td style={{ padding: "20px" }}>{(Pagination.page - 1) * Pagination.limit + index + 1}</td>
              <td style={{padding: "20px"}}>{d.property_name}</td>
              <td style={{ padding: "20px" }}>{d.document_name}</td>
              <td style={{ padding: "20px" }}>{d.document_type}</td>
              <td style={{ padding: "20px" }}>
                <Link to={`/documents/editdocuments/${d.property_name}`} className="btn btn-warning btn-sm" style={{ background: 'transparent', border: 'none' }}>
                  <i className="fas fa-edit" />
                  </Link>
                                <button
                  onClick={() => deleteDocuments(d._id)}
                  className="btn btn-danger btn-sm"
                  style={{ background: 'transparent', border: 'none' }}
                >
                  <i className="fas fa-trash" style={{color: 'red'}}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(Pagination.page - 1)}
          disabled={Pagination.page === 1}
        >
          «
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {Pagination.page} of {Pagination.totalPages}
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(Pagination.page + 1)}
          disabled={Pagination.page === Pagination.totalPages}
        >
          »
        </button>
      </div>
  
    </div>
  );
};

export default Documents;
