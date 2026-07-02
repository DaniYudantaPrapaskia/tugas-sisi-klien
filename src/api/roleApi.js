import axiosInstance from './axiosConfig';

export const roleApi = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/roles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (roleData) => {
    try {
      const response = await axiosInstance.post('/roles', roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, roleData) => {
    try {
      const response = await axiosInstance.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
