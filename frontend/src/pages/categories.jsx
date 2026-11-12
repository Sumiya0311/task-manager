import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(
        Array.isArray(data) ? data : data.results ?? []
      );
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId !== null) {
        await updateCategory(editingId, {
          name: trimmedName,
        });
      } else {
        await createCategory({
          name: trimmedName,
        });
      }

      const message =
        editingId !== null
          ? "Category updated successfully."
          : "Category created successfully.";

      setName("");
      setEditingId(null);

      await fetchCategories();
      setSuccess(message);
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.name?.[0] ||
          data?.detail ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await deleteCategory(id);

      setCategories((previous) =>
        previous.filter((category) => category.id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setName("");
      }

      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="categories-container">
      <header className="categories-header">
        <div>
          <h1>Manage Categories</h1>
          <p>
            Create and organize categories for
            your tasks.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="categories-back-link"
        >
          Back to Dashboard
        </Link>
      </header>

      <div className="categories-layout">
        <section className="category-form-card">
          <h2>
            {editingId !== null
              ? "Edit Category"
              : "Add New Category"}
          </h2>

          <p>
            Keep your tasks organized with
            meaningful categories.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="category-name">
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Work, Personal, Study"
              maxLength={100}
              required
            />

            <div className="category-form-actions">
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="category-list-section">
          <div className="category-section-header">
            <h2>My Categories</h2>
            <span className="category-count">
              {categories.length} Categories
            </span>
          </div>

          {error && (
            <p
              role="alert"
              className="category-error"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="category-success"
            >
              {success}
            </p>
          )}

          {loading && (
            <p>Loading categories...</p>
          )}

          {!loading &&
            categories.length === 0 && (
              <div className="category-empty-state">
                <h3>No categories yet</h3>
                <p>
                  Create your first category
                  using the form.
                </p>
              </div>
            )}

          {!loading &&
            categories.length > 0 && (
              <div className="category-list">
                {categories.map((category) => (
                  <article
                    className="category-card"
                    key={category.id}
                  >
                    <div className="category-info">
                      <span className="category-icon">
                        {category.name
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <h3>{category.name}</h3>
                    </div>

                    <div className="category-actions">
                      <button
                        type="button"
                        className="category-edit-btn"
                        onClick={() =>
                          handleEdit(category)
                        }
                        disabled={
                          deletingId === category.id
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="category-delete-btn"
                        onClick={() =>
                          handleDelete(category.id)
                        }
                        disabled={
                          deletingId === category.id
                        }
                      >
                        {deletingId === category.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}