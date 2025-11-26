import axios from 'axios';

const baseURL = '/api';

export const RolesServicio = {
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

export const UsuariosServicio = {
    getAll: async () => {
        const response = await axios.get(`${baseURL}/usuarios`);
        return response.data;
    },

    create: async (usuarioData) => {
        const response = await axios.post(`${baseURL}/usuarios`, usuarioData);
        return response.data;
    },

    update: async (id, usuarioData) => {
        const response = await axios.put(`${baseURL}/usuarios/${id}`, usuarioData);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`${baseURL}/usuarios/${id}`);
        return response.data;
    }
};

export const ProfesorService = {
    getHorarios: async (id) => {
        const response = await axios.get(`${baseURL}/profesores/horariosprofesor/${id}`);
        return response.data;
    },
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

export const othersRoles = {
    getAll: async () => {
        try {
            const response = await axios.get('/api/roles');
            return response.data;
        } catch (error) {
            console.error("Error en RolesServicio.getAll:", error);
            throw error;
        }
    },

    getPermissions: async () => {
        try {
            const response = await axios.get('/api/roles/permisos');
            return response.data;
        } catch (error) {
            console.error("Error en RolesServicio.getPermissions:", error);
            throw error;
        }
    },

    create: (data) => axios.post('/api/roles', data),

    update: (id, data) => axios.put(`/api/roles/${id}`, data),

    delete: (id) => axios.delete(`/api/roles/${id}`),
};