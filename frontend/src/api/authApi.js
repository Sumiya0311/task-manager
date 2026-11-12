import api from "./axios";

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );
  return response.data;
};

// Login and receive JWT tokens
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login/",
    credentials
  );
  return response.data;
};

// Get the logged-in user's profile
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");
  return response.data;
};

// Change the logged-in user's password
export const changePassword = async (passwordData) => {
  const response = await api.put(
    "/auth/change-password/",
    passwordData
  );
  return response.data;
};