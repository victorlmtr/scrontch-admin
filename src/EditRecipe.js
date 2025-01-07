import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StepForm from "./StepForm";

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

    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [ingredientSearch, setIngredientSearch] = useState("");
    const [types, setTypes] = useState([]);
    const [diets, setDiets] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [dropdownActive, setDropdownActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stepData, setStepData] = useState({ description: "", order: null });
    const handleAddOrUpdateStep = () => {
        setFormData((prev) => {
            const updatedSteps = stepData.id
                ? prev.steps.map((step) =>
                    step.id === stepData.id ? { ...step, ...stepData } : step
                )
                : [...prev.steps, { ...stepData, id: Date.now() }];
            return { ...prev, steps: updatedSteps };
        });
        setStepData({ description: "", order: null });
        setShowStepForm(false);
    };
    const [showStepForm, setShowStepForm] = useState(false);
    const handleAddIngredient = () => {
        setIngredients([...ingredients, newIngredient]);
        setNewIngredient({ name: "", quantity: "" });
    };

    const [newIngredient, setNewIngredient] = useState({ name: "", quantity: "" }); // Define newIngredient state


    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const ingredientResponse = await axios.get("http://localhost:8084/api/v1/ingredients");
                setIngredients(ingredientResponse.data);
                setFilteredIngredients(ingredientResponse.data);
            } catch (err) {
                console.error("Failed to fetch ingredients:", err);
            }
        };

        fetchIngredients();
    }, []);

    const handleIngredientSearch = (e) => {
        const search = e.target.value.toLowerCase();
        setIngredientSearch(search);
        setFilteredIngredients(
            ingredients.filter((ingredient) =>
                ingredient.name.toLowerCase().includes(search)
            )
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipeResponse = await axios.get(`http://localhost:8084/api/v1/recipes/${id}`);
                const typeResponse = await axios.get("http://localhost:8084/api/v1/types");
                const dietResponse = await axios.get("http://localhost:8082/api/v1/diets");
                const countriesResponse = await axios.get("http://localhost:8084/api/v1/countries");

                setFormData(recipeResponse.data);
                setTypes(typeResponse.data);
                setDiets(dietResponse.data);
                setCountries(countriesResponse.data);
                setFilteredCountries(countriesResponse.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCountrySelect = (countryId) => {
        setFormData((prev) => {
            const countries = prev.countries.includes(countryId)
                ? prev.countries.filter((id) => id !== countryId)
                : [...prev.countries, countryId];
            return { ...prev, countries };
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const updatedDiets = checked
                ? [...prev.recipediets, { dietid: parseInt(value) }]
                : prev.recipediets.filter((d) => d.dietid !== parseInt(value));
            return { ...prev, recipediets: updatedDiets };
        });
    };

    const handleEditStep = (stepId) => {
        const stepToEdit = formData.steps.find((step) => step.id === stepId);
        if (stepToEdit) {
            setStepData(stepToEdit);
            setShowStepForm(true);
        }
    };

    const handleDeleteStep = (stepId) => {
        setFormData((prev) => ({
            ...prev,
            steps: prev.steps.filter((step) => step.id !== stepId),
        }));
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredCountries(
            countries.filter((country) =>
                country.name.toLowerCase().includes(term)
            )
        );
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
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        className="form-control"
                        value={formData.notes}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Recipe Image</label>
                    <input
                        type="file"
                        id="image"
                        className="form-control"
                        onChange={handleImageUpload}
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

                <div className="mb-3">
                    <label className="form-label">Countries</label>
                    <div
                        className="form-control"
                        tabIndex={0}
                        onClick={() => setDropdownActive(!dropdownActive)}
                    >
                        {formData.countries.map((countryId) => {
                            const country = countries.find((c) => c.id === countryId);
                            return (
                                <span key={countryId} className="badge bg-primary me-2">
                                    {country?.name}
                                </span>
                            );
                        })}
                    </div>
                    {dropdownActive && (
                        <div className="dropdown-menu show w-100">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                            <ul className="list-group" style={{maxHeight: "200px", overflowY: "scroll"}}>
                                {filteredCountries.slice(0, 10).map((country) => (
                                    <li
                                        key={country.id}
                                        className={`list-group-item ${formData.countries.includes(country.id) ? "active" : ""}`}
                                        onClick={() => handleCountrySelect(country.id)}
                                    >
                                        {country.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Diets</label>
                    {diets.map((diet) => (
                        <div key={diet.id} className="form-check">
                            <input
                                type="checkbox"
                                id={`diet-${diet.id}`}
                                value={diet.id}
                                checked={formData.recipediets.some((d) => d.dietid === diet.id)}
                                onChange={handleCheckboxChange}
                                className="form-check-input"
                            />
                            <label htmlFor={`diet-${diet.id}`} className="form-check-label">
                                {diet.dietname}{" "}
                                <img
                                    src={diet.icon}
                                    alt={diet.dietname}
                                    style={{width: "20px", height: "20px", marginLeft: "5px"}}
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <h3>Steps</h3>
                    {formData.steps.map((step) => (
                        <div key={step.id} className="border p-3 mb-2">
                            <h5>{step.title}</h5>
                            <p><strong>Order:</strong> {step.order}
                            </p>
                            <p><strong>Length:</strong> {step.length} minutes</p>
                            <p>{step.description}</p> {}
                            {step.image && (
                                <img
                                    src={step.image}
                                    alt={`Step ${step.order}`}
                                    style={{width: "100px", height: "100px"}}
                                />
                            )}
                            <button
                                type="button"
                                className="btn btn-warning me-2"
                                onClick={() => handleEditStep(step.id)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDeleteStep(step.id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <StepForm
                    stepData={stepData}
                    handleStepInputChange={(e) =>
                        setStepData((prev) => ({...prev, [e.target.name]: e.target.value}))
                    }
                    handleStepImageUpload={(e) => {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () =>
                            setStepData((prev) => ({...prev, image: reader.result}));
                        if (file) reader.readAsDataURL(file);
                    }}
                    handleAddIngredient={handleAddIngredient}
                    handleAddStep={handleAddOrUpdateStep}
                    showStepForm={showStepForm}
                    setShowStepForm={setShowStepForm}
                    ingredientSearch={ingredientSearch}
                    filteredIngredients={filteredIngredients}
                    handleIngredientSearch={handleIngredientSearch}
                    newIngredient={newIngredient}
                    setNewIngredient={setNewIngredient}
                />

                <button type="submit" className="btn btn-primary">
                    Update Recipe
                </button>

            </form>
        </div>
    );
};

export default EditRecipe;
