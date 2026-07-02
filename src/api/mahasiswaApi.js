import axiosInstance from './axiosConfig';

export const mahasiswaApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/mahasiswa');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/mahasiswa/${id}`);
    return response.data;
  },

  create: async (mahasiswaData) => {
    const response = await axiosInstance.post('/mahasiswa', mahasiswaData);
    return response.data;
  },

  update: async (id, mahasiswaData) => {
    const response = await axiosInstance.put(`/mahasiswa/${id}`, mahasiswaData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/mahasiswa/${id}`);
    return response.data;
  },
};
