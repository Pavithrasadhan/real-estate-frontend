import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchMessages();
    } else {
      searchMessage();
    }
  }, [pagination.page, searchTerm]);

  const fetchMessages = async () => {
    try {
      const { page, limit } = pagination;
      const response = await axios.get(`${backendUrl}/api/messages`, {
        params: { page, limit },
      });

      setMessages(response.data.message || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const searchMessage = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/search/message`, {
        params: { search: searchTerm },
      });

      setMessages(response.data.message || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error searching messages:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/messages/${id}`);
      setMessages((prevMessages) => prevMessages.filter((message) => message._id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="container-fluid" style={{margin: "auto", padding: "20px", marginTop: '60px', fontFamily: "Arial, sans-serif" }}>
    
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Messages</h2>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />
      </div>

      <div>
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No messages found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {messages.map((message) => (
              <li
                key={message._id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <strong>{message.name} ({message.email})</strong>
                <p>{message.message}</p>
                <small style={{ color: "#777" }}>{new Date(message.createdAt).toLocaleString()}</small>
                <button
                  onClick={() => deleteMessage(message._id)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          style={{
            padding: "5px 15px",
            marginRight: "10px",
            cursor: pagination.page === 1 ? "not-allowed" : "pointer",
            backgroundColor: pagination.page === 1 ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
          «
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          style={{
            padding: "5px 15px",
            marginLeft: "10px",
            cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
            backgroundColor: pagination.page === pagination.totalPages ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
        >
       »
        </button>
      </div>
    </div>
  );
};

export default Message;
