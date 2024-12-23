import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [substitutes, setSubstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    categoryid: "",
    substitutes: [], // Track substitutes here
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsResponse, categoriesResponse, substitutesResponse] =
          await Promise.all([
            axios.get("http://localhost:8083/api/v1/ingredients"),
            axios.get("http://localhost:8083/api/v1/categories"),
            axios.get("http://localhost:8083/api/v1/ingredientSubstitutes"),
          ]);

        setIngredients(ingredientsResponse.data);
        setCategories(categoriesResponse.data);
        setSubstitutes(substitutesResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "N/A";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "N/A";
  };

  const handleEditClick = (ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      description: ingredient.description,
      image: ingredient.image,
      categoryid: ingredient.categoryid,
      substitutes: ingredient.substitutes || [], // Add current substitutes to the form
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
        const fileUrl = response.data.url; // Check the API for the correct key
        setFormData((prev) => ({ ...prev, image: fileUrl }));
        alert("Image uploaded successfully!");
      } else {
        alert(`Failed to upload image: ${response.statusText}`);
      }
    } catch (error) {
      alert("Error during image upload.");
    }
  };

  const handleSubstituteToggle = (substituteId) => {
    setFormData((prev) => {
      const substitutes = prev.substitutes.includes(substituteId)
        ? prev.substitutes.filter((id) => id !== substituteId)
        : [...prev.substitutes, substituteId];
      return { ...prev, substitutes };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedIngredient = {
        ...editingIngredient,
        ...formData,
        updatedat: new Date().toISOString(),
      };

      const response = await axios.put(
        `http://localhost:8083/api/v1/ingredients/${editingIngredient.id}`,
        updatedIngredient
      );

      setIngredients((prev) =>
        prev.map((ing) =>
          ing.id === editingIngredient.id ? response.data : ing
        )
      );
      setEditingIngredient(null);
    } catch (err) {
      alert("Failed to update ingredient!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="container mt-5">
      <h1>Admin Dashboard</h1>

      {editingIngredient && (
        <div className="edit-form">
          <h2>Edit Ingredient</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="categoryid"
                value={formData.categoryid}
                onChange={handleCategoryChange}
                className="form-control"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageUpload}
                className="form-control"
              />
              {formData.image && (
                <div>
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                </div>
              )}
            </div>

            {/* Ingredient Substitutes Section */}
            <div className="mb-3">
              <label htmlFor="substitutes" className="form-label">
                Substitutes
              </label>
              <div>
                {substitutes.map((substitute) => (
                  <div key={substitute.id} className="form-check">
                    <input
                      type="checkbox"
                      id={`substitute-${substitute.id}`}
                      className="form-check-input"
                      checked={formData.substitutes.includes(substitute.id)}
                      onChange={() => handleSubstituteToggle(substitute.id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`substitute-${substitute.id}`}
                    >
                      {substitute.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingIngredient(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Ingredient ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Category</th>
            <th>Substitutes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.id}</td>
              <td>{ingredient.name}</td>
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
                {ingredient.substitutes && ingredient.substitutes.length > 0
                  ? ingredient.substitutes
                      .map((substitute) => substitute.name)
                      .join(", ") // Join substitute names as comma-separated list
                  : "No substitutes"}
              </td>
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

export default AdminDashboard;
