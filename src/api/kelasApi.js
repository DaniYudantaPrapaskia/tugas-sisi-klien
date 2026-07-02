import axiosInstance from './axiosConfig';

export const kelasApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/kelas');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/kelas/${id}`);
    return response.data;
  },

  create: async (kelasData) => {
    const response = await axiosInstance.post('/kelas', kelasData);
    return response.data;
  },

  update: async (id, kelasData) => {
    const response = await axiosInstance.put(`/kelas/${id}`, kelasData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/kelas/${id}`);
    return response.data;
  },
};
