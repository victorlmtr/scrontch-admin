import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import RecipeDetail from "./RecipeDetail";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
