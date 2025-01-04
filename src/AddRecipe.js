import React, {useState, useEffect, useRef} from "react";
import axios from "axios";

const AddRecipe = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        difficulty: 1,
        portions: 1,
        notes: "",
        image: null,
        typeId: "",
        countries: [],
        recipediets: [],
        steps: [],
    });

    const [types, setTypes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownActive, setDropdownActive] = useState(false);
    const [showStepForm, setShowStepForm] = useState(false); // Toggle for step form
    const [stepData, setStepData] = useState({
        title: "",
        steporder: "",
        length: "",
        image: null,
        instructions: "",
        stepingredients: [],
    });
    const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState({
        ingredientid: null,
        quantity: 0,
        isoptional: false,
    });
    const dropdownRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesResponse, countriesResponse, dietsResponse, ingredientsResponse] = await Promise.all([
                    axios.get("http://localhost:8084/api/v1/types"),
                    axios.get("http://localhost:8084/api/v1/countries"),
                    axios.get("http://localhost:8082/api/v1/diets"),
                    axios.get("http://localhost:8083/api/v1/ingredients"),
                ]);
                setTypes(typesResponse.data);
                setCountries(countriesResponse.data);
                setFilteredCountries(countriesResponse.data);
                setDiets(dietsResponse.data);
                setAllIngredients(ingredientsResponse.data);
                setFilteredIngredients(ingredientsResponse.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredCountries(
                countries.filter((country) =>
                    country.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredCountries(countries);
        }
    }, [searchTerm, countries]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStepInputChange = (e) => {
        const { name, value } = e.target;
        setStepData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStepImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("No file selected.");
            return;
        }

        const imageData = new FormData();
        imageData.append("file", file);

        try {
            const response = await axios.post(
                "https://images.victorl.xyz/upload",
                imageData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setStepData((prev) => ({ ...prev, image: response.data.url }));
            alert("Step image uploaded successfully!");
        } catch (err) {
            alert("Failed to upload image.");
        }
    };

    const handleIngredientSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setIngredientSearchTerm(term);

        const filtered = allIngredients.filter(
            (ing) =>
                ing.name.toLowerCase().includes(term) ||
                (ing.alias && ing.alias.toLowerCase().includes(term))
        );
        setFilteredIngredients(filtered);
    };

    const handleAddIngredient = () => {
        if (!newIngredient.ingredientid) {
            alert("Please select an ingredient.");
            return;
        }
        const stepIngredient = {
            ...newIngredient,
            unitid: null, // Update this based on your implementation, e.g., dropdown for unit
            preparationid: null, // Update this as needed
        };

        setStepData((prev) => ({
            ...prev,
            stepingredients: [...prev.stepingredients, stepIngredient],
        }));

        setNewIngredient({ ingredientid: null, quantity: 0, isoptional: false });
    };

    const handleAddStep = (e) => {
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            steps: [...prev.steps, { ...stepData, steporder: parseInt(stepData.steporder), length: parseInt(stepData.length) }],
        }));
        setStepData({
            title: "",
            steporder: "",
            length: "",
            image: null,
            instructions: "",
            stepingredients: [],
        });
        setShowStepForm(false);
    };

    const handleCountrySelect = (id) => {
        setFormData((prev) => {
            const updatedCountries = prev.countries.includes(id)
                ? prev.countries.filter((countryId) => countryId !== id)
                : [...prev.countries, id];
            return { ...prev, countries: updatedCountries };
        });
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const currentValues = prev[field];
            if (checked) {
                return { ...prev, [field]: [...currentValues, value] };
            }
            return { ...prev, [field]: currentValues.filter((v) => v !== value) };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("No file selected.");
            return;
        }

        const imageData = new FormData();
        imageData.append("file", file);

        try {
            const response = await axios.post(
                "https://images.victorl.xyz/upload",
                imageData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setFormData((prev) => ({ ...prev, image: response.data.url }));
            alert("Image uploaded successfully!");
        } catch (err) {
            alert("Failed to upload image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8084/api/v1/recipes", {
                ...formData,
                recipediets: formData.recipediets.map((dietId) => ({ dietid: dietId })), // Transform diets to match RecipedietDto
            });
            alert("Recipe added successfully!");
            setFormData({
                name: "",
                description: "",
                difficulty: 1,
                portions: 1,
                notes: "",
                image: null,
                typeId: "",
                countries: [],
                recipediets: [],
                steps: [],
            });
        } catch (err) {
            alert("Failed to add recipe.");
        }
    };
    const handleDropdownToggle = () => setDropdownActive(!dropdownActive);
    const handleSearchBlur = (e) => {
        if (!dropdownRef.current.contains(e.relatedTarget)) {
            setDropdownActive(false);
        }
    }
    if (loading) return <div>Loading form data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div className="container mt-5">
            <h1>Add New Recipe</h1>
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
                    <label htmlFor="typeId" className="form-label">Type</label>
                    <select
                        id="typeId"
                        name="typeId"
                        className="form-select"
                        value={formData.typeId}
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

                <div className="mb-3" ref={dropdownRef}>
                    <label className="form-label">Countries</label>
                    <div
                        className="form-control"
                        tabIndex={0}
                        onClick={handleDropdownToggle}
                        onBlur={handleSearchBlur}
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <ul className="list-group" style={{maxHeight: "200px", overflowY: "scroll"}}>
                                {filteredCountries.slice(0, 10).map((country) => (
                                    <li
                                        key={country.id}
                                        className={`list-group-item ${
                                            formData.countries.includes(country.id)
                                                ? "active"
                                                : ""
                                        }`}
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
                                checked={formData.recipediets.includes(diet.id)}
                                onChange={(e) => handleCheckboxChange(e, "recipediets")}
                                className="form-check-input"
                            />
                            <label
                                htmlFor={`diet-${diet.id}`}
                                className="form-check-label"
                            >
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
                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        onClick={() => setShowStepForm(!showStepForm)}
                    >
                        {showStepForm ? "Cancel Step" : "Add New Step"}
                    </button>
                    {showStepForm && (
                        <form onSubmit={handleAddStep} className="mb-4">
                            <div className="mb-3">
                                <label htmlFor="step-title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    id="step-title"
                                    name="title"
                                    className="form-control"
                                    value={stepData.title}
                                    onChange={handleStepInputChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="step-order" className="form-label">Step Order</label>
                                <input
                                    type="number"
                                    id="step-order"
                                    name="steporder"
                                    className="form-control"
                                    value={stepData.steporder}
                                    onChange={handleStepInputChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="step-length" className="form-label">Length (minutes)</label>
                                <input
                                    type="number"
                                    id="step-length"
                                    name="length"
                                    className="form-control"
                                    value={stepData.length}
                                    onChange={handleStepInputChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="step-image" className="form-label">Image</label>
                                <input
                                    type="file"
                                    id="step-image"
                                    className="form-control"
                                    onChange={handleStepImageUpload}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="step-instructions" className="form-label">Instructions</label>
                                <textarea
                                    id="step-instructions"
                                    name="instructions"
                                    className="form-control"
                                    value={stepData.instructions}
                                    onChange={handleStepInputChange}
                                />
                            </div>

                            <div className="mb-3">
                                <h5>Add Ingredients</h5>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Search ingredients..."
                                    value={ingredientSearchTerm}
                                    onChange={handleIngredientSearchChange}
                                />
                                <select
                                    className="form-select mb-2"
                                    value={newIngredient.ingredientid || ""}
                                    onChange={(e) =>
                                        setNewIngredient((prev) => ({
                                            ...prev,
                                            ingredientid: parseInt(e.target.value, 10),
                                        }))
                                    }
                                >
                                    <option value="" disabled>
                                        Select an ingredient
                                    </option>
                                    {filteredIngredients.map((ingredient) => (
                                        <option key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newIngredient.quantity}
                                        onChange={(e) =>
                                            setNewIngredient((prev) => ({
                                                ...prev,
                                                quantity: parseFloat(e.target.value),
                                            }))
                                        }
                                    />
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isOptional"
                                        checked={newIngredient.isoptional}
                                        onChange={(e) =>
                                            setNewIngredient((prev) => ({
                                                ...prev,
                                                isoptional: e.target.checked,
                                            }))
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="isOptional">
                                        Is Optional?
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleAddIngredient}
                                >
                                    Add Ingredient
                                </button>
                            </div>


                            <button type="submit" className="btn btn-primary">
                                Add Step
                            </button>
                        </form>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Steps</label>
                    <ul className="list-group">
                        {formData.steps.map((step, index) => (
                            <li key={index} className="list-group-item">
                                <strong>{step.steporder}. {step.title}</strong> - {step.instructions}
                                {step.image && (
                                    <img
                                        src={step.image}
                                        alt={`Step ${step.steporder}`}
                                        style={{width: "50px", height: "50px", marginLeft: "10px"}}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>


                <button type="submit" className="btn btn-primary">Add Recipe</button>
            </form>
        </div>
    );
};

export default AddRecipe;
