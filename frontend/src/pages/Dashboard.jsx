import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../api/taskApi";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        if (active) {
          setStats(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.detail ||
              "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const completed = stats?.done ?? 0;
  const pending =
    (stats?.todo ?? 0) + (stats?.in_progress ?? 0);

  const completionPercentage =
    stats?.completion_percentage ?? 0;

  return (
    <main className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Task Manager Dashboard</h1>
          <p>
            Welcome back,{" "}
            {user?.first_name ||
              user?.email ||
              "User"}
            !
          </p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <nav
        className="dashboard-nav"
        aria-label="Dashboard navigation"
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">My Tasks</Link>
        <Link to="/tasks/new">Add Task</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/profile">My Profile</Link>
      </nav>

      <section className="dashboard-section">
        <h2>Task Overview</h2>
        <p>Track your tasks and monitor your progress.</p>

        {loading && <p>Loading dashboard...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && stats && (
          <>
            <div className="stats-grid">
              <article className="stat-card">
                <span className="stat-label">
                  Total Tasks
                </span>
                <strong className="stat-value">
                  {stats.total_tasks ?? 0}
                </strong>
                <span className="stat-description">
                  All your tasks
                </span>
              </article>

              <article className="stat-card">
                <span className="stat-label">
                  Completed
                </span>
                <strong className="stat-value">
                  {completed}
                </strong>
                <span className="stat-description">
                  Successfully finished
                </span>
              </article>

              <article className="stat-card">
                <span className="stat-label">
                  Pending
                </span>
                <strong className="stat-value">
                  {pending}
                </strong>
                <span className="stat-description">
                  To Do and In Progress
                </span>
              </article>

              <article className="stat-card">
                <span className="stat-label">
                  Overdue
                </span>
                <strong className="stat-value">
                  {stats.overdue ?? 0}
                </strong>
                <span className="stat-description">
                  Need your attention
                </span>
              </article>
            </div>

            <section className="progress-card">
              <h2>Completion Progress</h2>

              <div className="progress-details">
                <span>Tasks completed</span>
                <strong>
                  {completionPercentage}%
                </strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-label="Task completion progress"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, completionPercentage)
                    )}%`,
                  }}
                />
              </div>
            </section>

            <div className="dashboard-bottom-grid">
              <article className="summary-card">
                <h2>Task Status</h2>

                <p>
                  To Do: <strong>{stats.todo ?? 0}</strong>
                </p>
                <p>
                  In Progress:{" "}
                  <strong>{stats.in_progress ?? 0}</strong>
                </p>
                <p>
                  Done: <strong>{completed}</strong>
                </p>
                <p>
                  Due Today:{" "}
                  <strong>{stats.due_today ?? 0}</strong>
                </p>
              </article>

              <article className="summary-card">
                <h2>Quick Actions</h2>

                <div className="quick-actions">
                  <Link to="/tasks/new">
                    + Create New Task
                  </Link>
                  <Link to="/tasks">
                    View All Tasks
                  </Link>
                  <Link to="/categories">
                    Manage Categories
                  </Link>
                </div>
              </article>
            </div>
          </>
        )}
      </section>
    </main>
  );
}