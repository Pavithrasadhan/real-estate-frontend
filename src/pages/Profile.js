import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Profile() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!userId || !authToken) {
      navigate("/login");
      return;
    }

    axios
      .get(`${backendUrl}/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.message || "Error fetching profile"));
  }, [userId, authToken, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = { ...user };
    if (password) updatedData.password = password;

    axios
      .put(`${backendUrl}/api/user/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        setUser(res.data);
        alert("Profile updated successfully!");
        navigate("/");
      })
      .catch((err) => setError(err.response?.data?.message || "Error updating profile"))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete(`${backendUrl}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then(() => {
          localStorage.clear();
          navigate("/signup"); 
        })
        .catch((err) => setError(err.response?.data?.message || "Error deleting account"));
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-4 rounded w-50">
          <h2 className="text-center">My Profile</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label><strong>First Name</strong></label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label><strong>Last Name</strong></label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label><strong>Email</strong></label>
              <input type="email" value={user.email} disabled className="form-control" />
            </div>

            <div className="mb-3">
              <label><strong>Phone</strong></label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label><strong>Role</strong></label>
              <input type="text" value={user.role} disabled className="form-control" />
            </div>

            <div className="mb-3">
              <label><strong>New Password (optional)</strong></label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>

          <button className="btn btn-danger w-100 mt-3" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
