import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "ingredients" ? "active" : ""}`}
          onClick={() => setActiveTab("ingredients")}
        >
          Ingredients
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => setActiveTab("recipes")}
        >
          Recipes
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </li>
    </ul>
  );
};

export default Tabs;
