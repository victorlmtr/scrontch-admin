import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipesTab = ({ onViewRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:8084/api/v1/recipes");
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
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Difficulty</th>
            <th>Portions</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.name}</td>
                <td>{recipe.description}</td>
                <td>{recipe.difficulty}</td>
                <td>{recipe.portions}</td>
                <td>{recipe.typeid?.typename || "N/A"}</td>
                <td>
                  <button onClick={() => onViewRecipe(recipe.id)}>View</button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default RecipesTab;
