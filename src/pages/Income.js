import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const IncomeExpense = () => {
  const [income, setIncome] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [Pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchIncome();
    } else {
      searchIncomeExpense();
    }
  }, [Pagination.page]); 

  const fetchIncome = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { page, limit };

      const incomeResponse = await axios.get(`${backendUrl}/api/income`, { params });
      const expenseResponse = await axios.get(`${backendUrl}/api/expense`, { params });
      const combinedRecords = [
        ...(incomeResponse.data.income || []),
        ...(expenseResponse.data.expense || []),
      ];
      setIncome(combinedRecords);
      setPagination((prev) => ({
        ...prev,
        total: incomeResponse.data.total || 0,
        totalPages: incomeResponse.data.totalPages || 1,
      }));
    } catch (error) {
      console.log("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  const searchIncomeExpense = async () => {
    try {
      const { page, limit } = Pagination;
      const params = { search: searchTerm, page, limit };
      const response = await axios.get(`${backendUrl}/api/search/incomeexpense`, { params });
      setIncome(response.data.IncomeExpenses || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error searching income/expense:", error);
      alert("Failed to search income/expense. Please try again.");
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

  const deleteRecord = async (id, type) => {
    try {
      await axios.delete(`${backendUrl}/api/${type.toLowerCase()}/${id}`);
      setIncome((prevIncome) => prevIncome.filter((record) => record._id !== id));
    } catch (err) {
      console.log("Error deleting record:", err);
      alert("Failed to delete record. Please try again.");
    }
  };

  return (
   <div className = "container-fluid" >
      <div className="content-header" style={{ marginTop: '60px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3 style={{ margin: "0" }}>Income/Expense List:</h3>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="form-inline">
              <div className="input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search Income/Expense"
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

          <Link
            to="/income/addincome"
            className="btn btn-primary btn-sm"
            style={{ borderRadius: "20px" }}
          >
            <i className="fas fa-plus" style={{ color: 'white' }} /> Add Income/Expense
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
            <th>Property Name</th>
            <th>Agent Name</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {income.map((r, index) => (
            <tr
              key={r._id}
              className={r.type === "Income" ? "table-success" : "table-danger"}
            >
              <td style={{ textAlign: "center" }}>
                {(Pagination.page - 1) * Pagination.limit + index + 1}
              </td>
              <td>{r.property_name}</td>
              <td>{r.agent_name}</td>
              <td>{r.amount}</td>
              <td>{r.type}</td>
              <td style={{ textAlign: "center" }}>
                <Link
                  to={`/income/editincome/${r.property_name}`}
                  className="btn btn-info btn-sm mx-1"
                >
                  <i className="fas fa-edit" />
                </Link>
                <button
                  onClick={() => deleteRecord(r._id, r.type)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash" />
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

export default IncomeExpense;
