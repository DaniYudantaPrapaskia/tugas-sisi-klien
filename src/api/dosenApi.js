import axiosInstance from './axiosConfig';

// API endpoints untuk Dosen
export const dosenApi = {
  // Get all dosen
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/dosen');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get dosen by ID
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/dosen/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new dosen
  create: async (dosenData) => {
    try {
      const response = await axiosInstance.post('/dosen', dosenData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update dosen
  update: async (id, dosenData) => {
    try {
      const response = await axiosInstance.put(`/dosen/${id}`, dosenData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete dosen
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/dosen/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
