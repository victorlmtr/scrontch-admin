import React from "react";

const RecipeForm = ({ formData, handleInputChange, handleImageUpload, types, handleCountrySelect, countries, filteredCountries, dropdownActive, setDropdownActive, searchTerm, setSearchTerm, handleCheckboxChange, diets, handleSubmit }) => {
    return (
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

            {/* Countries Dropdown */}
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
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                            ```jsx
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
                            checked={formData.recipediets.some(d => d.dietid === diet.id)}
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

            <button type="submit" className="btn btn-primary">Add Recipe</button>
        </form>
    );
};

export default RecipeForm;