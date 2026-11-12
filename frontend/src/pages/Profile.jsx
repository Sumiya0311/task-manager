import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentUser,
  changePassword,
} from "../api/authApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const data = await getCurrentUser();

        if (active) {
          setUser(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load profile."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.new_password !==
      form.confirm_password
    ) {
      setError("New passwords do not match.");
      return;
    }

    if (
      form.old_password ===
      form.new_password
    ) {
      setError(
        "New password must differ from current password."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await changePassword(form);

      setSuccess(
        response.message ||
          "Password changed successfully."
      );

      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      const data = err.response?.data;

      const message =
        data?.old_password?.[0] ||
        data?.new_password?.[0] ||
        data?.confirm_password?.[0] ||
        data?.non_field_errors?.[0] ||
        data?.detail ||
        "Unable to change password.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayName = user
    ? [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ") || "Task Manager User"
    : "Task Manager User";

  const initials = user
    ? [user.first_name, user.last_name]
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"
    : "U";

  return (
    <main className="profile-container">
      <header className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p>
            Manage your account information
            and security settings.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="profile-back-link"
        >
          Back to Dashboard
        </Link>
      </header>

      <div className="profile-layout">
        <section className="profile-details">
          <h2>Account Information</h2>

          {loading && (
            <p>Loading profile...</p>
          )}

          {!loading && user && (
            <>
              <div className="profile-user-summary">
                <div className="profile-avatar">
                  {initials}
                </div>

                <div>
                  <h3>{displayName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-info-list">
                <div className="profile-info-row">
                  <span>First Name</span>
                  <strong>
                    {user.first_name ||
                      "Not provided"}
                  </strong>
                </div>

                <div className="profile-info-row">
                  <span>Last Name</span>
                  <strong>
                    {user.last_name ||
                      "Not provided"}
                  </strong>
                </div>

                <div className="profile-info-row">
                  <span>Email Address</span>
                  <strong>
                    {user.email}
                  </strong>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="change-password">
          <h2>Change Password</h2>

          <p className="profile-section-description">
            Update your password to keep your
            account secure.
          </p>

          {error && (
            <p
              role="alert"
              className="error-message"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="success-message"
            >
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label htmlFor="old_password">
                Current Password
              </label>

              <input
                id="old_password"
                type="password"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="new_password">
                New Password
              </label>

              <input
                id="new_password"
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="confirm_password">
                Confirm New Password
              </label>

              <input
                id="confirm_password"
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="profile-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}