import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Tabs from "./Tabs";
import IngredientsTab from "./IngredientsTab";
import RecipesTab from "./RecipesTab";
import UsersTab from "./UsersTab";
import RecipeDetail from "./RecipeDetail";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const navigate = useNavigate();

  const renderTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return <IngredientsTab />;
      case "recipes":
        return <RecipesTab onViewRecipe={(id) => navigate(`/recipes/${id}`)} />;
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
        <div>
          <Routes>
            <Route path="/" element={renderTabContent()} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
          </Routes>
        </div>
      </div>
  );
};

export default AdminDashboard;
