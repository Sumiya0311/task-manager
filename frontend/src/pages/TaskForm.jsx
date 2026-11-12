import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createTask,
  getTask,
  updateTask,
} from "../api/taskApi";

import { getCategories } from "../api/categoryApi";

const initialForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  category: "",
  due_date: "",
};

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryData = await getCategories();

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : categoryData.results ?? []
        );

        if (isEditing) {
          const task = await getTask(id);

          setFormData({
            title: task.title ?? "",
            description: task.description ?? "",
            status: task.status ?? "To Do",
            priority: task.priority ?? "Medium",
            category: task.category ?? "",
            due_date: task.due_date ?? "",
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load task information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.title.trim().length < 3) {
      setError("Title must contain at least 3 characters.");
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      title: formData.title.trim(),
      category: formData.category
        ? Number(formData.category)
        : null,
      due_date: formData.due_date || null,
    };

    try {
      if (isEditing) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }

      navigate("/tasks");
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        setError(
          Object.entries(data)
            .map(([field, message]) =>
              `${field}: ${
                Array.isArray(message)
                  ? message.join(", ")
                  : message
              }`
            )
            .join(" | ")
        );
      } else {
        setError("Unable to save task.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading task form...</p>;
  }

  return (
    <main className="task-form-container">
      <h1>{isEditing ? "Edit Task" : "Create Task"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            minLength={3}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">No Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="due_date">Due Date</label>
          <input
            id="due_date"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Task"
              : "Create Task"}
        </button>

        <p>
          <Link to="/tasks">Cancel</Link>
        </p>
      </form>
    </main>
  );
}