import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewLeads = () => {
  const { property_name } = useParams();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [property_name]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lead/property/${property_name}`);
      setLeads(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching leads:', error);
      setError("Error fetching leads details. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  if (!Array.isArray(leads) || leads.length === 0) {
    return <div className='text-center mt-5'>Leads not found!</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px" }}>
      <h3 className='text-center mt-3 mb-4'>
        {leads.length > 0 ? leads[0].property_name : 'Leads'}
      </h3>
      <Link
        to={`/leads/editleads/${property_name}`}
        className="btn btn-primary"
        style={{ marginRight: '10px', marginBottom: '10px', padding: '5px 15px', fontSize: '14px', width: '120px' }}
      >
        Edit Leads
      </Link>

      <div className='row'>
        {leads.map((lead, index) => (
          <div key={lead._id || index} className='col-md-6 col-lg-6 mb-4'>
            <div className='card shadow-sm rounded p-3'>
              <div className='card-body'>
                <div className='row'>
                  <p><strong>Buyer Name:</strong> {lead.buyer_name}</p>
                  <p><strong>Agent Name:</strong> {lead.agent_name}</p>
                  <p><strong>Status:</strong> {lead.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewLeads;
