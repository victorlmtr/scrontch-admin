import React from "react";

const StepForm = ({ stepData, handleStepInputChange, handleStepImageUpload, handleAddIngredient, ingredientSearchTerm, handleIngredientSearchChange, filteredIngredients, newIngredient, setNewIngredient, handleAddStep, showStepForm, setShowStepForm }) => {
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