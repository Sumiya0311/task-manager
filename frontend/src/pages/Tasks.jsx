import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getTasks,
  deleteTask,
  toggleTaskComplete,
} from "../api/taskApi";

import { getCategories } from "../api/categoryApi";

import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";

const DEFAULT_ORDERING = "-created_at";

function getPage(params) {
  const value = Number(params.get("page") || 1);
  return Number.isSafeInteger(value) && value > 0
    ? value
    : 1;
}

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] =
    useState(urlSearch);

  const statusFilter = searchParams.get("status") || "";
  const priorityFilter = searchParams.get("priority") || "";
  const categoryFilter = searchParams.get("category") || "";
  const dueFilter = searchParams.get("due") || "";
  const ordering =
    searchParams.get("ordering") || DEFAULT_ORDERING;
  const page = getPage(searchParams);

  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounce search by 500 milliseconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Persist debounced search in the URL.
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    setSearchParams(
      (previous) => {
        const params = new URLSearchParams(previous);

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        } else {
          params.delete("search");
        }

        params.delete("page");
        return params;
      },
      { replace: true }
    );
  }, [debouncedSearch, urlSearch, setSearchParams]);

  // Restore search when browser history changes.
  useEffect(() => {
    if (
      urlSearch !== debouncedSearch &&
      search === debouncedSearch
    ) {
      setSearch(urlSearch);
      setDebouncedSearch(urlSearch);
    }
  }, [urlSearch]);

  // Load categories.
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (!cancelled) {
          setCategories(
            Array.isArray(data)
              ? data
              : data.results ?? []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load categories.");
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const searchIsPending =
    search.trim() !== debouncedSearch;

  // Load tasks with search, filters, and pagination.
  useEffect(() => {
    if (searchIsPending || debouncedSearch !== urlSearch) {
      return;
    }

    let cancelled = false;

    async function loadTasks() {
      setLoading(true);
      setError("");

      try {
        const params = { page, ordering };

        if (debouncedSearch) {
          params.search = debouncedSearch;
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
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [
    debouncedSearch,
    urlSearch,
    searchIsPending,
    statusFilter,
    priorityFilter,
    categoryFilter,
    dueFilter,
    ordering,
    page,
    refreshKey,
  ]);

  // Update a filter and reset pagination.
  const changeFilter = (key, value) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      if (
        value &&
        !(key === "ordering" && value === DEFAULT_ORDERING)
      ) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }

      params.delete("page");
      return params;
    });
  };

  // Change the current page.
  const changePage = (newPage) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }

      return params;
    });
  };

  // Clear all search and filter settings.
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSearchParams({}, { replace: true });
  };

  // Open the custom confirmation dialog.
  const handleDelete = (id) => {
    if (processingId !== null) return;
    setTaskToDelete(id);
  };

  // Delete only after the user confirms.
  const confirmDelete = async () => {
    if (taskToDelete === null || processingId !== null) {
      return;
    }

    const id = taskToDelete;

    setProcessingId(id);
    setError("");

    try {
      await deleteTask(id);

      setTaskToDelete(null);

      if (tasks.length === 1 && page > 1) {
        changePage(page - 1);
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

  // Close the dialog without deleting.
  const cancelDelete = () => {
    if (processingId !== null) return;
    setTaskToDelete(null);
  };

  // Toggle task completion.
  const handleToggleComplete = async (id) => {
    if (processingId !== null) return;

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

        <Link to="/tasks/new">
          + Add New Task
        </Link>
      </header>

      {/* Search and filters */}
      <section className="task-filters">
        <h2>Search and Filter Tasks</h2>

        <input
          type="search"
          aria-label="Search tasks"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) =>
            changeFilter("status", e.target.value)
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
            changeFilter("priority", e.target.value)
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
            changeFilter("category", e.target.value)
          }
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={String(category.id)}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by due date"
          value={dueFilter}
          onChange={(e) =>
            changeFilter("due", e.target.value)
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
            changeFilter("ordering", e.target.value)
          }
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
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

      {!loading &&
        !error &&
        !searchIsPending &&
        debouncedSearch === urlSearch && (
          <p>Total matching tasks: {totalCount}</p>
        )}

      {(loading ||
        searchIsPending ||
        debouncedSearch !== urlSearch) && (
        <Loader message="Loading tasks..." />
      )}

      {error && !searchIsPending && (
        <p role="alert">{error}</p>
      )}

      {!loading &&
        !searchIsPending &&
        debouncedSearch === urlSearch &&
        !error &&
        tasks.length === 0 && (
          <p>No matching tasks found.</p>
        )}

      {/* Reusable task cards */}
      {!loading &&
        !searchIsPending &&
        debouncedSearch === urlSearch &&
        !error &&
        tasks.length > 0 && (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                processingId={processingId}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      {/* Pagination */}
      {!loading &&
        !searchIsPending &&
        debouncedSearch === urlSearch &&
        !error &&
        totalCount > 0 && (
          <div className="pagination">
            <button
              type="button"
              disabled={
                !hasPrevious || processingId !== null
              }
              onClick={() => changePage(page - 1)}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={
                !hasNext || processingId !== null
              }
              onClick={() => changePage(page + 1)}
            >
              Next
            </button>
          </div>
        )}

      {/* Custom confirmation dialog */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={
          taskToDelete !== null &&
          processingId === taskToDelete
        }
      />
    </main>
  );
}