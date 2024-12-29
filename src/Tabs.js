import React from "react";
import { useNavigate } from "react-router-dom";

const Tabs = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "ingredients" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("ingredients");
                        navigate("/"); // Adjust path if needed
                    }}
                >
                    Ingredients
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "recipes" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("recipes");
                        navigate("/"); // Adjust path if needed
                    }}
                >
                    Recipes
                </button>
            </li>
            <li className="nav-item">
                <button
                    className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("users");
                        navigate("/"); // Adjust path if needed
                    }}
                >
                    Users
                </button>
            </li>
        </ul>
    );
};

export default Tabs;
