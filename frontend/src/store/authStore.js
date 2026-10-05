import { create } from "zustand";
import Axios from "axios";

const API_URL = "http://localhost:5001/api/v1/auth";

Axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const response = await Axios.post(`${API_URL}/sign-up`, {
        email,
        password,
        username,
      });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error singining up",
        isLoading: false,
      });

      setTimeout(() => {
        set({ error: null });
      }, 2000);

      throw error;
    }
  },

  verifyEmail: async (enterCode) => {
    set({ error: null, isLoading: true });
    try {
      const response = await Axios.post(`${API_URL}/verify-email`, {
        enterCode,
      });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email ",
        isLoading: false,
      });

      setTimeout(() => {
        set({ error: null });
      }, 2000);

      throw error;
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await Axios.post(`${API_URL}/sign-in`, {
        email,
        password,
      });
      set({
        user: response.data.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "signing error !!",
        isLoading: false,
      });

      setTimeout(() => {
        set({ error: null });
      }, 2000);

      throw error;
    }
  },

  signout: async () => {
    set({ isLoading: true, error: null });
    try {
      await Axios.post(`${API_URL}/sign-out`);
      set({ isLoading: false, user: null, isAuthenticated: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed!!",
        isLoading: false,
      });
      setTimeout(() => {
        set({ error: null });
      }, 2000);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await Axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Forgot Password failed!!",
        isLoading: false,
      });
      setTimeout(() => {
        set({ error: null });
      }, 2000);
      throw error;
    }
  },

  updateProfile: async (username, email) => {
    set({ isLoading: true, error: null });

    try {
      await Axios.patch(`${API_URL}/update-profile`, { username, email });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.error?.message || "updating profile error!!",
      });
      setTimeout(() => {
        set({ error: null });
      }, 2000);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await Axios.post(`${API_URL}/reset-password/${token}`, { newPassword });
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.error?.message ||
          "Error sending Reset Password mail!!",
      });
      setTimeout(() => {
        set({ error: null });
      }, 2000);
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await Axios.post(`${API_URL}/check-auth`);
      set({
        user: response.data.data,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
      setTimeout(() => {
        set({ error: null });
      }, 2000);
      throw error;
    }
  },
}));
