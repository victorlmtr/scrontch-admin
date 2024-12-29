import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipesTab = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8083/api/v1/recipes"
        );
        setRecipes(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>Error fetching recipes: {error.message}</div>;

  return (
    <div>
      <h2>Recipes</h2>
      {/* Render recipes list here */}
    </div>
  );
};

export default RecipesTab;
