import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const RecipesTab = () => {
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

  const deleteRecipe = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8084/api/v1/recipes/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (err) {
      alert("Error deleting recipe: " + err.message);
    }
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>Error fetching recipes: {error.message}</div>;

  return (
      <div>
        <h2>Recipes</h2>
        <Link to="/add-recipe" className="btn btn-primary">
          Add New Recipe
        </Link>
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
                  <Link to={`/recipes/${recipe.id}`} className="btn">
                    View
                  </Link>
                  <Link
                      to={`/recipes/${recipe.id}/edit`}
                      className="btn"
                      style={{marginLeft: "8px"}}
                  >
                    Edit
                  </Link>
                  <button
                      onClick={() => deleteRecipe(recipe.id)}
                      style={{marginLeft: "8px", color: "red"}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default RecipesTab;
