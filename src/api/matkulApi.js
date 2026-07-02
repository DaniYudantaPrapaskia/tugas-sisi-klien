import axiosInstance from "./axiosConfig";

// API endpoints untuk Mata Kuliah
export const matkulApi = {
   // Get all mata kuliah
   getAll: async () => {
      try {
         const response = await axiosInstance.get("/matkul");
         return response.data;
      } catch (error) {
         throw error;
      }
   },

   // Get mata kuliah by ID
   getById: async (id) => {
      try {
         const response = await axiosInstance.get(`/matkul/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   },

   // Create new mata kuliah
   create: async (matkulData) => {
      try {
         const response = await axiosInstance.post("/matkul", matkulData);
         return response.data;
      } catch (error) {
         throw error;
      }
   },

   // Update mata kuliah
   update: async (id, matkulData) => {
      try {
         const response = await axiosInstance.put(
            `/matkul/${id}`,
            matkulData,
         );
         return response.data;
      } catch (error) {
         throw error;
      }
   },

   // Delete mata kuliah
   delete: async (id) => {
      try {
         const response = await axiosInstance.delete(`/matkul/${id}`);
         return response.data;
      } catch (error) {
         throw error;
      }
   },
};
