import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTasks,
  deleteTask,
  toggleTaskComplete,
} from "../api/taskApi";
import { getCategories } from "../api/categoryApi";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueFilter, setDueFilter] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load categories
  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const data = await getCategories();

        if (!cancelled) {
          setCategories(
            Array.isArray(data) ? data : data.results ?? []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load categories.");
        }
      }
    };

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load tasks using backend filters
  useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          ordering,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (statusFilter) {
          params.status = statusFilter;
        }

        if (priorityFilter) {
          params.priority = priorityFilter;
        }

        if (categoryFilter) {
          params.category = categoryFilter;
        }

        if (dueFilter) {
          params.due = dueFilter;
        }

        const data = await getTasks(params);

        if (cancelled) return;

        if (Array.isArray(data)) {
          setTasks(data);
          setTotalCount(data.length);
          setHasNext(false);
          setHasPrevious(false);
        } else {
          setTasks(data.results ?? []);
          setTotalCount(data.count ?? 0);
          setHasNext(Boolean(data.next));
          setHasPrevious(Boolean(data.previous));
        }
      } catch (err) {
        if (cancelled) return;

        setTasks([]);
        setError(
          err.response?.data?.detail ||
            "Unable to load tasks."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
    dueFilter,
    ordering,
    page,
    refreshKey,
  ]);

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
    setDueFilter("");
    setOrdering("-created_at");
    setPage(1);
  };

  // Delete task
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    setProcessingId(id);
    setError("");

    try {
      await deleteTask(id);

      if (tasks.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to delete task."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Toggle completion
  const handleToggleComplete = async (id) => {
    setProcessingId(id);
    setError("");

    try {
      await toggleTaskComplete(id);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update task completion."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / 10)
  );

  return (
    <main className="tasks-container">
      <header>
        <h1>My Tasks</h1>
        <p>View and manage your tasks.</p>

        <Link to="/tasks/new">+ Add New Task</Link>
      </header>

      {/* Search and filters */}
      <section className="task-filters">
        <h2>Search and Filter Tasks</h2>

        <input
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            changeFilter(setSearch, e.target.value)
          }
        />

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) =>
            changeFilter(setStatusFilter, e.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          aria-label="Filter by priority"
          value={priorityFilter}
          onChange={(e) =>
            changeFilter(setPriorityFilter, e.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) =>
            changeFilter(setCategoryFilter, e.target.value)
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by due date"
          value={dueFilter}
          onChange={(e) =>
            changeFilter(setDueFilter, e.target.value)
          }
        >
          <option value="">All Due Dates</option>
          <option value="today">Due Today</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
        </select>

        <select
          aria-label="Sort tasks"
          value={ordering}
          onChange={(e) =>
            changeFilter(setOrdering, e.target.value)
          }
        >
          <option value="-created_at">
            Newest First
          </option>
          <option value="created_at">
            Oldest First
          </option>
          <option value="due_date">
            Due Date: Earliest First
          </option>
          <option value="-due_date">
            Due Date: Latest First
          </option>
          <option value="priority">
            Priority: A to Z
          </option>
          <option value="-priority">
            Priority: Z to A
          </option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
        >
          Clear Filters
        </button>
      </section>

      {!loading && !error && (
        <p>Total matching tasks: {totalCount}</p>
      )}

      {loading && <p>Loading tasks...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>No matching tasks found.</p>
      )}

      {/* Task list */}
      {!loading && !error && tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => {
            const isComplete = task.status === "Done";

            return (
              <article
                className="task-card"
                key={task.id}
              >
                <h2>{task.title}</h2>

                {task.description && (
                  <p>{task.description}</p>
                )}

                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.due_date || "Not set"}
                </p>

                <div className="task-actions">
                  <Link to={`/tasks/${task.id}/edit`}>
                    Edit Task
                  </Link>

                  {" "}

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() =>
                      handleToggleComplete(task.id)
                    }
                  >
                    {processingId === task.id
                      ? "Updating..."
                      : isComplete
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </button>

                  {" "}

                  <button
                    type="button"
                    disabled={processingId !== null}
                    onClick={() => handleDelete(task.id)}
                  >
                    {processingId === task.id
                      ? "Processing..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalCount > 0 && (
        <div className="pagination">
          <button
            type="button"
            disabled={!hasPrevious || processingId !== null}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!hasNext || processingId !== null}
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}