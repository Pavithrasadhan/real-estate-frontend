import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === ''){
    fetchAmenities();
    }else{
      searchAmenities();
    }
  }, [Pagination.page, searchTerm]);

  const fetchAmenities = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { page, limit };

      const response = await axios.get(`${backendUrl}/api/amenities`, { params });
      setAmenities(response.data.amenities || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.log("Error fetching Amenities data");
    }
  };

  const searchAmenities = async () => {
    try {
      const params = { search: searchTerm };
      const response = await axios.get(`${backendUrl}/api/search/amenities`, { params });
      setAmenities(response.data.amenities || []);
      setPagination({
        ...Pagination,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      });
    } catch (error) {
      console.error('Error searching amenities:', error);
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


  const deleteAmenities = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/amenities/${id}`);
      setAmenities(amenities.filter(a => a._id !== id));
    } catch (err) {
      console.log("Error deleting amenities:", err);
    }
  };

  

  return (
    <div className="container-fluid">
      <div className="content-header" style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h3 style={{ margin: "0" }}>Amenities List:</h3>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search Amenities"
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
          <Link to="/amenities/addamenities" className="btn btn-primary btn-sm" style={{ borderRadius: "20px" }}>
            <i className="fas fa-plus" style={{ color: 'white'}}/> Add Amenities
          </Link>
        </div>
      </div>

      <table className="table" style={{ marginTop: "5px", borderCollapse: "separate", width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: "15px" }}>No</th>
            <th style={{padding: "15px"}}>Name</th>
            <th style={{ padding: "15px" }}>icon</th>
            <th style={{ padding: "15px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {amenities.map((a, index) => (
            <tr key={a._id}>
              <td style={{ padding: "20px" }}>{(Pagination.page - 1) * Pagination.limit + index + 1 }</td>
              <td style={{padding: "20px"}}>{a.name}</td>
              <td style={{ padding: "20px" }}>{a.icon}</td>
              <td style={{ padding: "20px" }}>
               <Link to={`/amenities/editamenities/${a._id}`} className="btn btn-info btn-sm" style={{ background: 'transparent', border: 'none' }}>
                <i className="fas fa-edit" />
              </Link>
                <button
                  onClick={() => deleteAmenities(a._id)}
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

export default Amenities;
