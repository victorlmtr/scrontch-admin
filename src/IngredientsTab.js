import React, { useEffect, useState } from "react";
import axios from "axios";

const IngredientsTab = () => {
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    description: "",
    image: "",
    categoryid: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:8083/api/v1/ingredients"),
          axios.get("http://localhost:8083/api/v1/categories"),
        ]);
        setIngredients(ingredientsResponse.data);
        setFilteredIngredients(ingredientsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter ingredients based on name or alias
    const filtered = ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(term) ||
        (ingredient.alias && ingredient.alias.toLowerCase().includes(term))
    );
    setFilteredIngredients(filtered);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const handleEditClick = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      alias: ingredient.alias || "",
      description: ingredient.description,
      image: ingredient.image,
      categoryid: ingredient.categoryid,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, categoryid: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://images.victorl.xyz/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const fileUrl = response.data.url;
        setFormData((prev) => ({ ...prev, image: fileUrl }));
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image: " + response.statusText);
      }
    } catch (error) {
      alert("Error during image upload.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedIngredient = {
        ...formData,
        updatedat: new Date().toISOString(),
      };

      if (editingIngredient) {
        // Update existing ingredient
        const response = await axios.put(
            `http://localhost:8083/api/v1/ingredients/${editingIngredient.id}`,
            updatedIngredient
        );

        setIngredients((prev) =>
            prev.map((ing) =>
                ing.id === editingIngredient.id ? response.data : ing
            )
        );
        setFilteredIngredients((prev) =>
            prev.map((ing) =>
                ing.id === editingIngredient.id ? response.data : ing
            )
        );
        setEditingIngredient(null);
      } else {
        // Add new ingredient
        const response = await axios.post(
            "http://localhost:8083/api/v1/ingredients",
            updatedIngredient
        );

        setIngredients((prev) => [...prev, response.data]);
        setFilteredIngredients((prev) => [...prev, response.data]);
      }
      setFormData({
        name: "",
        alias: "",
        description: "",
        image: "",
        categoryid: "",
        isFemale: false, // Reset the isFemale value
      });
      setIsAdding(false);
    } catch (err) {
      alert("Failed to save ingredient!");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="container mt-5">
      <h1>Ingredients</h1>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search ingredients by name or alias..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Add Ingredient Button */}
      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setIsAdding(true);
          setEditingIngredient(null);
          setFormData({
            name: "",
            alias: "",
            description: "",
            image: "",
            categoryid: "",
          });
        }}
      >
        Add New Ingredient
      </button>

      {/* Ingredient Form for Adding or Editing */}
      {(isAdding || editingIngredient) && (
          <div className="edit-form">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="alias" className="form-label">
                  Alias
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="categoryid" className="form-label">
                  Category
                </label>
                <select
                    className="form-select"
                    id="categoryid"
                    name="categoryid"
                    value={formData.categoryid}
                    onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="isFemale"
                    name="isFemale"
                    checked={formData.isFemale}
                    onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFemale: e.target.checked,
                        }))
                    }
                />
                <label className="form-check-label" htmlFor="isFemale">
                  Is Female?
                </label>
              </div>

              <div className="mb-3">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
      )}


      {/* Ingredient List */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Ingredient ID</th>
            <th>Name</th>
            <th>Alias</th>
            <th>Description</th>
            <th>Image</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.id}</td>
              <td>{ingredient.name}</td>
              <td>{ingredient.alias || "No alias"}</td>
              <td>{ingredient.description || "No description"}</td>
              <td>
                {ingredient.image ? (
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    style={{ width: "50px" }}
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>{getCategoryName(ingredient.categoryid)}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditClick(ingredient)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTab;
