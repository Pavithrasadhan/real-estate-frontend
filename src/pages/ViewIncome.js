import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewIncome = () => {
  const { property_name } = useParams(); 
  const [incomeexpense, setIncomeExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, [property_name]);

  const fetchIncome = async () => {
    try {
      const income = await axios.get(`${backendUrl}/api/income/property/${property_name}`);
      const expense = await axios.get(`${backendUrl}/api/expense/property/${property_name}`);
      console.log('Income:', income.data);
      console.log('Expense:', expense.data);
      const incomeexpense = [
        ...income.data, 
        ...expense.data,
      ];
      if (incomeexpense.length === 0) {
        setError("No income or expenses found for this property.");
      } else {
        setIncomeExpense(incomeexpense);
      }
  
      setLoading(false);
    } catch (error) {
      console.log("Error fetching data:", error);
      setError("Failed to load data. Please try again."); 
      setLoading(false);
    }
  };
  
  if (loading) 
    return <div className='text-center mt-5'>Loading...</div>;
  if (error)
    return <div className='text-center mt-5 text-danger'>{error}</div>;
  if (!Array.isArray(incomeexpense) || incomeexpense.length === 0) {
    return <div className='text-center mt-5'>No income or expenses found for this property.</div>;
  }

  return (
    <div className="container-fluid" style={{ marginTop: "60px"}}>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
        <div className='card shadow-lg p-4 rounded' style={{width: '400px'}}>
          <Link to={`/income/editincome/${property_name}`} className='btn btn-primary' style={{padding: '8px 20px', fontSize: '14px'}}>
            IncomeExpense
          </Link>
          <div className='card-body text-center'>
            <h5 className='card-header mb-3' style={{fontWeight: 'bold'}}>
              {incomeexpense.length > 0 ? incomeexpense[0].property_name : 'Property not found'}
            </h5>
            <div className='text-start'>
              {incomeexpense.map((income, index) => (
                <div key={income._id || index}>
                  <p><strong>Agent Name:</strong> {income.agent_name || 'N/A'}</p>
                  <p><strong>Amount:</strong> {income.amount || 'N/A'}</p>
                  <p><strong>Type:</strong> {income.type || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIncome;
