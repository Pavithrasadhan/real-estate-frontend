import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/${id}`);
        console.log("Backend Response:", response.data);
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.log("Error fetching User:", error);
        setError("Error fetching User details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Only id is needed in the dependency array

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found!</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "30px" }}>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow-lg p-4 rounded" style={{ width: "400px" }}>
          <div className="card-body text-center">
            <h4 className="card-header mb-3" style={{ fontWeight: "bold" }}>User Details</h4>

            <div className="text-start">
              <p><strong>First Name:</strong> {user.first_name}</p>
              <p><strong>Last Name:</strong> {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>

            <hr className="my-4" style={{ width: "80%", margin: "auto" }} />

            <Link
              to={`/properties/viewpropertylist/${user.role}/${user.first_name}`}
              className="btn btn-primary w-100 mt-3"
            >
              View Property Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
