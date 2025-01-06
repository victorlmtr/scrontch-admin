import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        difficulty: 1,
        portions: 1,
        notes: "",
        typeid: "",
        countries: [],
        recipediets: [],
    });
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeResponse = await axios.get(`http://localhost:8084/api/v1/recipes/${id}`);
                const typeResponse = await axios.get("http://localhost:8084/api/v1/types");
                setFormData(recipeResponse.data);
                setTypes(typeResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8084/api/v1/recipes/${id}`, formData);
            alert("Recipe updated successfully!");
            navigate("/");
        } catch (err) {
            alert("Failed to update recipe: " + err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Edit Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="difficulty" className="form-label">Difficulty (1-3)</label>
                    <input
                        type="number"
                        id="difficulty"
                        name="difficulty"
                        className="form-control"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        min={1}
                        max={3}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="portions" className="form-label">Portions</label>
                    <input
                        type="number"
                        id="portions"
                        name="portions"
                        className="form-control"
                        value={formData.portions}
                        onChange={handleInputChange}
                        step="0.1"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="typeid" className="form-label">Type</label>
                    <select
                        id="typeid"
                        name="typeid"
                        className="form-select"
                        value={formData.typeid}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a type</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.typename}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Recipe</button>
            </form>
        </div>
    );
};

export default EditRecipe;
