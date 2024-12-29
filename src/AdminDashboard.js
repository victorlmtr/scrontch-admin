import React, { useState } from "react";
import Tabs from "./Tabs";
import IngredientsTab from "./IngredientsTab";
import RecipesTab from "./RecipesTab";
import UsersTab from "./UsersTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("ingredients");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return <IngredientsTab />;
      case "recipes":
        return <RecipesTab />;
      case "users":
        return <UsersTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;
