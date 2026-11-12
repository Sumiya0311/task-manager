import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      formData.password !== formData.confirm_password
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      navigate("/login", { replace: true });
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data).map(
          ([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "string"
              ? value
              : JSON.stringify(value);

            return `${field}: ${message}`;
          }
        );

        setError(messages.join(" | "));
      } else {
        setError(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h1>Task Manager</h1>
        <h2>Create Account</h2>

        <p>
          Register to start managing your tasks.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first-name">
              First Name
            </label>

            <input
              id="first-name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>

          <div>
            <label htmlFor="last-name">
              Last Name
            </label>

            <input
              id="last-name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          <div>
            <label htmlFor="register-email">
              Email
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}