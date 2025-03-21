import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const User = () => {
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchUser();
    } else {
      searchUser();
    }
  }, [Pagination.page]);

  const fetchUser = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { page, limit };

      const response = await axios.get(`${backendUrl}/api/user`, { params });
      setUser(response.data.users || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.log("Error fetching users:", error);
      alert("Failed to fetch users. Please try again.");
    }
  };

  const searchUser = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { search: searchTerm, page, limit };
      const response = await axios.get(`${backendUrl}/api/search/user`, { params });
      setUser(response.data.user || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error('Error searching user:', error);
      alert("Failed to search users. Please try again.");
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

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/user/${id}`);
      setUser(user.filter((u) => u._id !== id));
      fetchUser();
    } catch (err) {
      console.log("Error deleting user:", err);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className='container-fluid' >
      <div className="content-header" style={{ marginTop: '60px' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: '100%' }}>
          <h3 style={{ margin: "0" }}>Users List:</h3>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search Users"
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
          <Link to="/user/adduser" className="btn btn-primary btn-sm" style={{ borderRadius: "20px" }}>
            <i className="fas fa-plus" style={{ color: 'white' }} /> Add User
          </Link>
        </div>
      </div>

      <table className="table" style={{ marginTop: "5px", borderCollapse: "collapse", width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: "15px" }}>Id</th>
            <th style={{ padding: "15px" }}>Image</th>
            <th style={{ padding: "15px" }}>First Name</th>
            <th style={{ padding: "15px" }}>Last Name</th>
            <th style={{ padding: "15px" }}>Email</th>
            <th style={{ padding: "15px" }}>Phone</th>
            <th style={{ padding: "15px" }}>Role</th>
            <th style={{ padding: "15px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {user.length > 0 ? (
            user.map((u, index) => (
              <tr key={u._id}>
                <td style={{ padding: "20px" }}>{(Pagination.page - 1) * Pagination.limit + index + 1}</td>
                <td>
                  {u.image ? (
                    <img
                      src={`${backendUrl}/${u.image.replace(/\\/g, '/')}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      alt='Agent'
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td style={{ padding: "20px" }}>{u.first_name}</td>
                <td style={{ padding: "20px" }}>{u.last_name}</td>
                <td style={{ padding: "20px" }}>{u.email}</td>
                <td style={{ padding: "20px" }}>{u.phone}</td>
                <td style={{ padding: "20px" }}>{u.role}</td>
                <td style={{ padding: "20px" }}>
                  <Link to={`/user/viewuser/${u._id}`} className="btn btn-info btn-sm" style={{backgroundColor: 'white', border: 'none'}}>
                    <i className="fas fa-eye" />
                  </Link>
                  <Link to={`/user/edituser/${u._id}`} className="btn btn-warning btn-sm" style={{backgroundColor: 'white', border: 'none'}}>
                    <i className="fas fa-edit" />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(u._id)}
                    style={{backgroundColor: 'white', border: 'none'}}
                  >
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No users found</td>
            </tr>
          )}
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

export default User;
