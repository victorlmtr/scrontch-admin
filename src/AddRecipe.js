import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import RecipeForm from "./RecipeForm";
import StepForm from "./StepForm";
import IngredientList from "./IngredientList";

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
    const [showStepForm, setShowStepForm] = useState(false);
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
            unitid: null,
            preparationid: null,
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
            const response = await axios.post ("http://localhost:8084/api/v1/recipes", {
                ...formData,
                recipediets: formData.recipediets.map((dietId) => ({ dietid: dietId })),
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

    if (loading) return <div>Loading form data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div className="container mt-5">
            <h1>Add New Recipe</h1>
            <RecipeForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleImageUpload={handleImageUpload}
                types={types}
                handleCountrySelect={handleCountrySelect}
                countries={countries}
                filteredCountries={filteredCountries}
                dropdownActive={dropdownActive}
                setDropdownActive={setDropdownActive}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleCheckboxChange={handleCheckboxChange}
                diets={diets}
                handleSubmit={handleSubmit}
            />
            <StepForm
                stepData={stepData}
                handleStepInputChange={handleStepInputChange}
                handleStepImageUpload={handleStepImageUpload}
                handleAddIngredient={handleAddIngredient}
                ingredientSearchTerm={ingredientSearchTerm}
                handleIngredientSearchChange={handleIngredientSearchChange}
                filteredIngredients={filteredIngredients}
                newIngredient={newIngredient}
                setNewIngredient={setNewIngredient}
                handleAddStep={handleAddStep}
                showStepForm={showStepForm}
                setShowStepForm={setShowStepForm}
            />
            <IngredientList steps={formData.steps} />
        </div>
    );
};

export default AddRecipe;