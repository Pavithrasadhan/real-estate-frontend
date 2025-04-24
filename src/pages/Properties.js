import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = useCallback(async () => {
    try {
      const { page, limit } = pagination;
      const params = { page, limit };

      const response = await axios.get(`${backendUrl}/api/properties`, { params });

      setProperties(response.data.properties || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [pagination.page, pagination.limit]);

  const searchProperties = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/properties/search/${searchTerm}`);
      setProperties(response.data.properties || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error searching properties:', error);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchProperties();
    } else {
      searchProperties();
    }
  }, [pagination.page, searchTerm, fetchProperties, searchProperties]);

  const debouncedSearch = useMemo(() => debounce((value) => {
    setSearchTerm(value);
  }, 300), []);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/properties/${id}`);
      setProperties(properties.filter((property) => property._id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className = "container-fluid" >
      <div className="content-header" style={{ marginTop: '60px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3 style={{ margin: '0' }}>Properties List:</h3>

          <div>
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search Properties"
                aria-label="Search"
                style={{ borderRadius: '20px' }}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <Link to="/properties/addproperties" className="btn btn-primary btn-sm" style={{ borderRadius: '20px' }}>
            <i className="fas fa-plus" style={{ color: 'white' }} /> Add Properties
          </Link>
        </div>
      </div>

      <table
        className="table"
        style={{ marginTop: '5px', borderCollapse: 'separate', width: '100%' }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Image</th>
            <th>Name</th>
            <th>Type</th>
            <th>Beds</th>
            <th>Baths</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map((p, index) => (
              <tr key={p._id}>
                <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                <td>
                  {Array.isArray(p.image) && p.image.length > 0 ? (
                    <img
                      src={'https://real-estate-backend-r07w.onrender.com/uploads/${p.image[0].replace(/\\/g, '/')}'}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      alt="property"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.beds}</td>
                <td>{p.baths}</td>
                <td>
                  <Link to={`/properties/viewproperties/${p._id}`} className="btn btn-info btn-sm" style={{ background: 'transparent', border: 'none' }}>
                    <i className="fas fa-eye" />
                  </Link>
                  <Link to={`/properties/editproperties/${p._id}`} className="btn btn-warning btn-sm" style={{ background: 'transparent', border: 'none' }}>
                    <i className="fas fa-edit" />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProperty(p._id)}
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <i className="fas fa-trash" style={{ color: 'red' }} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No properties found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          «
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Properties;
