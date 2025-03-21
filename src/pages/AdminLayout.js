// AdminLayout.js
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLayout = ({ children }) => {
  return (
    <div className="content-wrapper">
      <Header />
        <Sidebar />
        
          {children}
    
      <Footer />
    </div>
  );
};

export default AdminLayout;
