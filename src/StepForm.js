import React, { useEffect, useState } from "react";
import axios from "axios";

const StepForm = ({ stepData, handleStepInputChange, handleStepImageUpload, handleAddIngredient, ingredientSearchTerm, handleIngredientSearchChange, filteredIngredients, newIngredient, setNewIngredient, handleAddStep, showStepForm, setShowStepForm }) => {
    const [units, setUnits] = useState([]);
    const [preparationMethods, setPreparationMethods] = useState([]);
    const [newUnitName, setNewUnitName] = useState("");
    const [newPreparationMethodName, setNewPreparationMethodName] = useState("");


    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get("http://localhost:8084/api/v1/units");
                setUnits(response.data);
            } catch (error) {
                console.error("Error fetching units:", error);
            }
        };

        const fetchPreparationMethods = async () => {
            try {
                const response = await axios.get("http://localhost:8084/api/v1/preparationmethods");
                setPreparationMethods(response.data);
            } catch (error) {
                console.error("Error fetching preparation methods:", error);
            }
        };

        fetchUnits();
        fetchPreparationMethods();
    }, []);

    const handleCreateUnit = async () => {
        if (!newUnitName) {
            alert("Please enter a unit name.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8084/api/v1/units", { unitname: newUnitName });
            setUnits((prevUnits) => [...prevUnits, response.data]);
            setNewUnitName("");
            alert("Unit created successfully!");
        } catch (error) {
            alert("Failed to create unit.");
        }
    };

    const handleCreatePreparationMethod = async () => {
        if (!newPreparationMethodName) {
            alert("Please enter a preparation method name.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8084/api/v1/preparationmethods", { name: newPreparationMethodName });
            setPreparationMethods((prevMethods) => [...prevMethods, response.data]);
            setNewPreparationMethodName("");
            alert("Preparation method created successfully!");
        } catch (error) {
            alert("Failed to create preparation method.");
        }
    };

    return (
        <>
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
                        <div className="mb-3">
                            <label htmlFor="unitId" className="form-label">Unit</label>
                            <select
                                className="form-select"
                                value={newIngredient.unitid || ""}
                                onChange={(e) =>
                                    setNewIngredient((prev) => ({
                                        ...prev,
                                        unitid: parseInt(e.target.value, 10),
                                    }))
                                }
                            >
                                <option value="" disabled>Select a unit</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.unitname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newUnitName" className="form-label">Create New Unit</label>
                            <input
                                type="text"
                                id="newUnitName"
                                className="form-control"
                                value={newUnitName}
                                onChange={(e) => setNewUnitName(e.target.value)}
                            />
                            <button type="button" className="btn btn-primary mt-2" onClick={handleCreateUnit}>
                                Create Unit
                            </button>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="preparationId" className="form-label">Preparation Method</label>
                            <select
                                className="form-select"
                                value={newIngredient.preparationid || ""}
                                onChange={(e) =>
                                    setNewIngredient((prev) => ({
                                        ...prev,
                                        preparationid: parseInt(e.target.value, 10),
                                    }))
                                }
                            >
                                <option value="" disabled>Select a preparation method</option>
                                {preparationMethods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newPreparationMethodName" className="form-label">Create New Preparation
                                Method</label>
                            <input
                                type="text"
                                id="newPreparationMethodName"
                                className="form-control"
                                value={newPreparationMethodName}
                                onChange={(e) => setNewPreparationMethodName(e.target.value)}
                            />
                            <button type="button" className="btn btn-primary mt-2"
                                    onClick={handleCreatePreparationMethod}>
                                Create Preparation Method
                            </button>
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
        </>
    );
};

export default StepForm;