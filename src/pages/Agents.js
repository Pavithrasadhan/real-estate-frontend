import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Agents = () => {
  const [agent, setAgent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 2,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchAgent();
    } else {
      searchAgent();
    }
  }, [pagination.page, searchTerm]);

  const fetchAgent = async () => {
    try {
      const { page, limit } = pagination;
      const params = { page, limit };

      const response = await axios.get(`${backendUrl}/api/agent`, { params });
      const agentsData = response.data.agent || [];

      const updatedAgents = await Promise.all(
        agentsData.map(async (a) => {
          if (!a.image && a.user_id) {
            try {
              const userResponse = await axios.get(`${backendUrl}/api/user/${a.user_id}`);
              const userImage = userResponse.data.user.image;
              a.image = userImage;
            } catch (err) {
              console.error('Error fetching user image:', err);
            }
          }
          return a;
        })
      );

      setAgent(updatedAgents);

      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.log('Error fetching agents:', error);
    }
  };

  const searchAgent = async () => {
    try {
      const params = { search: searchTerm };
      const response = await axios.get(`${backendUrl}/api/search/agents`, { params });
      setAgent(response.data.agents || []);
      setPagination({
        ...pagination,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      });
    } catch (error) {
      console.error('Error searching agent:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const deleteAgent = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/agent/${id}`);
      setAgent(agent.filter((a) => a._id !== id));
      fetchAgent();
    } catch (err) {
      console.error('Error deleting agent:', err);
    }
  };

  return (
    <div className = "container-fluid" >
      <div className="content-header" style={{ marginTop: '60px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3 style={{ margin: '0' }}>Agents List:</h3>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div className="form-inline">
              <div className="input-group" data-widget="sidebar-search">
                <input
                  className="form-control form-control-sidebar"
                  type="search"
                  placeholder="Search Agents"
                  aria-label="Search"
                  style={{ borderRadius: '20px', width: '300px' }}
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
          <Link
            to="/agents/addagents"
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '20px' }}
          >
            <i className="fas fa-plus" style={{color: 'white'}}/> Add Agent
          </Link>
        </div>
      </div>

      <table
        className="table"
        style={{ marginTop: '5px', borderCollapse: 'separate', width: '100%' }}
      >
        <thead>
          <tr>
            <th style={{ padding: '15px', textAlign: 'center' }}>No</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Image</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Agent Name</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Contact Info</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Year Of Experience</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Language(s)</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Expertise</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>BRN</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Description</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
  {agent.length > 0 ? (
    agent.map((a, index) => (
      <tr key={a._id}>
        <td style={{ textAlign: 'center' }}>
          {(pagination.page - 1) * pagination.limit + index + 1}
        </td>
        <td>
          {a.image ? (
            <img
              src={`${backendUrl}/${a.image.replace(/\\/g, '/')}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              alt="Agent"
            />
          ) : (
            <span>No Image</span> 
          )}
        </td>
        <td style={{ textAlign: 'center' }}>{a.agent_name || a.first_name}</td>
        <td style={{ textAlign: 'center' }}>{a.contact_info || a.phone}</td>
        <td style={{ textAlign: 'center' }}>{a.yearofexperience}</td>
        <td style={{ textAlign: 'center' }}>{a.languagespoken}</td>
        <td style={{ textAlign: 'center' }}>{a.expertise}</td>
        <td style={{ textAlign: 'center' }}>{a.BRN}</td>
        <td style={{ textAlign: 'center' }}>{a.description}</td>
        <td style={{ textAlign: 'center' }}>
          <Link
            to={`/agents/editagents/${a._id}`}
            className="btn btn-warning btn-sm"
            style={{ background: 'transparent', border: 'none' }}
          >
            <i className="fas fa-edit" />
          </Link>
          <button
            onClick={() => deleteAgent(a._id)}
            className="btn btn-danger btn-sm"
            style={{ background: 'transparent', border: 'none' }}
          >
            <i className="fas fa-trash" style={{ color: 'red' }} />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" style={{ textAlign: 'center' }}>
        No agents found.
      </td>
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

export default Agents;
