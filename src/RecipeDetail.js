import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecipeDetail = () => {
    const { id } = useParams(); // Get recipe ID from the URL
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8084/api/v1/recipes/${id}`
                );
                setRecipe(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <div>Loading recipe details...</div>;
    if (error) return <div>Error fetching recipe: {error.message}</div>;
    if (!recipe) return <div>No recipe found</div>;

    return (
        <div>
            <h1>{recipe.name}</h1>
            <img src={recipe.image} alt={recipe.name} style={{ width: "100%", maxWidth: "400px" }} />
            <p><strong>Description:</strong> {recipe.description}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Portions:</strong> {recipe.portions}</p>
            <p><strong>Notes:</strong> {recipe.notes || "None"}</p>
            <p><strong>Type:</strong> {recipe.typeid?.typename}</p>
            <p><strong>Created At:</strong> {new Date(recipe.createdat).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(recipe.updatedat).toLocaleString()}</p>
            <h3>Steps</h3>
            <ol>
                {recipe.steps.map((step) => (
                    <li key={step.id}>
                        <h4>{step.title}</h4>
                        <p><strong>Instructions:</strong> {step.instructions}</p>
                        <p><strong>Length:</strong> {step.length} minutes</p>
                        <ul>
                            {step.stepingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    {ingredient.quantity} {ingredient.unitid?.unitname} of Ingredient ID: {ingredient.ingredientid}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RecipeDetail;
