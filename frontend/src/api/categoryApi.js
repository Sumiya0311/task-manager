import api from "./axios";

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories/");
  return response.data;
};

// Create a category
export const createCategory = async (data) => {
  const response = await api.post("/categories/", data);
  return response.data;
};

// Update a category
export const updateCategory = async (id, data) => {
  const response = await api.patch(
    `/categories/${id}/`,
    data
  );
  return response.data;
};

// Delete a category
export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}/`);
};