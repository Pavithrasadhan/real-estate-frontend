import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Income from "./pages/Income";
import 'bootstrap/dist/css/bootstrap.min.css';
import Addproperties from "./pages/Addproperties";
import Assets from "./pages/Assets";
import Addassets from "./pages/Addassets";
import Documents from "./pages/Documents";
import AddDocuments from "./pages/AddDocuments";
import AddIncome from "./pages/AddIncome";
import User from "./pages/User";
import AddUser from "./pages/AddUser";
import Agents from "./pages/Agents";
import AddAgents from "./pages/AddAgents";
import Message from "./pages/Message";
import Leads from "./pages/Leads";
import AddLeads from "./pages/AddLeads";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import EditAgents from "./pages/EditAgents";
import EditAssets from "./pages/EditAssets";
import EditDocument from "./pages/EditDocuments";
import EditIncome from "./pages/EditIncome";
import EditLead from "./pages/EditLead";
import EditProperties from "./pages/EditProperties";
import EditUser from "./pages/EditUser";
import Amenities from "./pages/Amenities";
import AddAmenities from "./pages/AddAmenities";
import EditAmenities from "./pages/EditAmenities";
import ViewProperties from "./pages/ViewProperties";
import ViewUser from "./pages/ViewUser";
import ViewAssets from "./pages/ViewAssets";
import ViewIncome from "./pages/ViewIncome";
import ViewDocuments from "./pages/ViewDocuments";
import ViewLeads from "./pages/ViewLeads";
import ViewPropertyList from "./pages/ViewPropertyList";
import HeroPage from "./pages/HeroPage";
import AdminLayout from "./pages/AdminLayout";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import AgentListView from "./pages/AgentListView";
import AgentDetails from "./pages/AgentDetails";
import AgentProperties from "./pages/AgentProperties";
import Profile from "./pages/Profile";
import OwnerDetails from "./pages/OwnerDetails";
import ContactForm from "./pages/ContactForm";

function App() {
  return (
    <Router>
       
       <Routes>

  <Route path="/" element={<HeroPage />} />
  <Route path ='/profile' element={<Profile />} />
  <Route path="/propertylist" element={<PropertyList />} />
  <Route path="/propertydetail/:property_name" element={<PropertyDetail />} />
  <Route path="/agentlistview" element={<AgentListView />} />
  <Route path="/agentdetail/:agent_name" element={<AgentDetails />} /> 
  <Route path="/agentproperties/:property_name" element={<AgentProperties />} />
  <Route path="/ownerdetails/:owner_name" element ={<OwnerDetails />}/>
  <Route path="/contact" element={<ContactForm />} />
    
  <Route path="/home" element={<AdminLayout><Home /></AdminLayout>} />
  <Route path="/properties" element={<AdminLayout><Properties /></AdminLayout>} />
  <Route path="/properties/addproperties" element={<AdminLayout><Addproperties /></AdminLayout>} />
  <Route path="/properties/editproperties/:id" element={<AdminLayout><EditProperties /></AdminLayout>} />
  <Route path="/properties/viewproperties/:id" element={<AdminLayout><ViewProperties /></AdminLayout>} />
  <Route path="/properties/viewpropertylist/:role/:name" element={<AdminLayout><ViewPropertyList /></AdminLayout>} />

  <Route path="/assets" element={<AdminLayout><Assets /></AdminLayout>} />
  <Route path="/assets/addassets" element={<AdminLayout><Addassets /></AdminLayout>} />
  <Route path="/assets/editassets/:property_name" element={<AdminLayout><EditAssets /></AdminLayout>} />
  <Route path="/assets/viewassets/:property_name" element={<AdminLayout><ViewAssets /></AdminLayout>} />

  <Route path="/documents" element={<AdminLayout><Documents /></AdminLayout>} />
  <Route path="/documents/adddocuments" element={<AdminLayout><AddDocuments /></AdminLayout>} />
  <Route path="/documents/editdocuments/:property_name" element={<AdminLayout><EditDocument /></AdminLayout>} />
  <Route path="/documents/viewdocuments/:property_name" element={<AdminLayout><ViewDocuments /></AdminLayout>} />

  <Route path="/income" element={<AdminLayout><Income /></AdminLayout>} />
  <Route path="/income/addincome" element={<AdminLayout><AddIncome /></AdminLayout>} />
  <Route path="/income/editincome/:property_name" element={<AdminLayout><EditIncome /></AdminLayout>} />
  <Route path="/income/viewincome/:property_name" element={<AdminLayout><ViewIncome /></AdminLayout>} />

  <Route path="/user" element={<AdminLayout><User /></AdminLayout>} />
  <Route path="/user/adduser" element={<AdminLayout><AddUser /></AdminLayout>} />
  <Route path="/user/edituser/:id" element={<AdminLayout><EditUser /></AdminLayout>} />
  <Route path="/user/viewuser/:id" element={<AdminLayout><ViewUser /></AdminLayout>} />

  <Route path="/agents" element={<AdminLayout><Agents /></AdminLayout>} />
  <Route path="/agents/addagents" element={<AdminLayout><AddAgents /></AdminLayout>} />
  <Route path="/agents/editagents/:id" element={<AdminLayout><EditAgents /></AdminLayout>} />

  <Route path="/message" element={<AdminLayout><Message /></AdminLayout>} />
  <Route path="/leads" element={<AdminLayout><Leads /></AdminLayout>} />
  <Route path="/leads/addleads" element={<AdminLayout><AddLeads /></AdminLayout>} />
  <Route path="/leads/editleads/:property_name" element={<AdminLayout><EditLead /></AdminLayout>} />
  <Route path="/leads/viewleads/:property_name" element={<AdminLayout><ViewLeads /></AdminLayout>} />

  <Route path="/amenities" element={<AdminLayout><Amenities /></AdminLayout>} />
  <Route path="/amenities/addamenities" element={<AdminLayout><AddAmenities /></AdminLayout>} />
  <Route path="/amenities/editamenities/:id" element={<AdminLayout><EditAmenities /></AdminLayout>} />

  <Route path="/signin" element={<SignIn />} />
  <Route path="/signup" element={<SignUp />} />
  
</Routes>

        
    </Router>
  );
}

export default App;
