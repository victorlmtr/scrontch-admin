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
    const file = e.target.files[0]; // Get the file from the input
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

      console.log("Upload response:", response);

      if (response.status === 200) {
        const fileUrl = response.data.url; // Check the API for the correct key
        alert("Image uploaded successfully!");
        console.log("Uploaded file URL:", fileUrl);
      } else {
        console.error("Upload failed:", response);
        alert(`Failed to upload image: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during image upload:", error);

      if (error.response) {
        // Server error
        console.error("Server responded with:", error.response.data);
        alert(
          `Server Error: ${error.response.data.message || "Upload failed"}`
        );
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request);
        alert(
          "No response received from the server. Check network or server status."
        );
      } else {
        // Other errors
        alert(`Unexpected error: ${error.message}`);
      }
    }
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
            <th>Created At</th>
            <th>Updated At</th>
            <th>Category</th>
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
              <td>
                {ingredient.createdat
                  ? new Date(ingredient.createdat).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {ingredient.updatedat
                  ? new Date(ingredient.updatedat).toLocaleString()
                  : "N/A"}
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

export default AdminDashboard;
