import api from "./axios";

// Get tasks with optional filters and pagination
export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks/", { params });
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get("/tasks/dashboard/");
  return response.data;
};

// Get one task
export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}/`);
  return response.data;
};

// Create a task
export const createTask = async (data) => {
  const response = await api.post("/tasks/", data);
  return response.data;
};

// Update a task
export const updateTask = async (id, data) => {
  const response = await api.patch(`/tasks/${id}/`, data);
  return response.data;
};

// Delete a task
export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}/`);
};

// Toggle task completion
export const toggleTaskComplete = async (id) => {
  const response = await api.patch(
    `/tasks/${id}/toggle-complete/`
  );
  return response.data;
};