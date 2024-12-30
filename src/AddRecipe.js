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
    });

    const [types, setTypes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownActive, setDropdownActive] = useState(false);

    const dropdownRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesResponse, countriesResponse, dietsResponse] = await Promise.all([
                    axios.get("http://localhost:8084/api/v1/types"),
                    axios.get("http://localhost:8084/api/v1/countries"),
                    axios.get("http://localhost:8084/api/v1/recipediets"),
                ]);
                setTypes(typesResponse.data);
                setCountries(countriesResponse.data);
                setFilteredCountries(countriesResponse.data);
                setDiets(dietsResponse.data);
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
            const response = await axios.post("http://localhost:8084/api/v1/recipes", formData);
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
                                {diet.name}
                            </label>
                        </div>
                    ))}
                </div>

                <button type="submit" className="btn btn-primary">Add Recipe</button>
            </form>
        </div>
    );
};

export default AddRecipe;
