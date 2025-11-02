import axios from 'axios';

const baseURL = '/api';

export const ProfesorService = {
    getAll: async () => {
        const response = await axios.get(`${baseURL}/profesores`);
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${baseURL}/profesores/${id}`);
        return response.data;
    },

    create: async (profesorData) => {
        const response = await axios.post(`${baseURL}/profesores`, profesorData);
        return response.data;
    },

    update: async (id, profesorData) => {
        const response = await axios.put(`${baseURL}/profesores/${id}`, profesorData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`${baseURL}/profesores/${id}`);
        return response.data;
    }
};

export const SalonService = {
    getAll: async () => {
        const response = await axios.get(`${baseURL}/salones`);
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${baseURL}/salones/${id}`);
        return response.data;
    },

    create: async (salonData) => {
        const response = await axios.post(`${baseURL}/salones`, salonData);
        return response.data;
    },

    update: async (id, salonData) => {
        const response = await axios.put(`${baseURL}/salones/${id}`, salonData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`${baseURL}/salones/${id}`);
        return response.data;
    },

    getDisponibles: async () => {
        const response = await axios.get(`${baseURL}/salones-disponibles`);
        return response.data;
    }
};