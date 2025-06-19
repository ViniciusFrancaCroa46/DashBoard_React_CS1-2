import axios from 'axios';

const api = axios.create({
    baseURL:'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});


// Add request interceptor for logging
api.interceptors.request.use(
    config => {
        console.log('Fazendo requisição para:', config.url);
        return config;
    },
    error => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Resposta de:', response.config.url, response.status);
        return response;
    },
    error => {
        console.error('Erro na resposta:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Cliente endpoints
export const equipamentoService ={
    createEA: (data) => api.post('/equipamentos/registrar', data),
    getEA: () => api.get('/equipamentos/listar'),
    getEAbyId: (id) => api.get(`/equipamentos/listar/${id}`),
    deleteEA: (id) => api.get(`/equipamentos/listar/${id}`),
    updateEA: (id) => api.put(`/equipamentos/listar/${id}/status`, data)
};

export const produtoService ={
    createProd: (data) => api.post('/produtos/registrar', data),
    getProd: () => api.get('/produtos/listar'),
    getProdbyId: (id) => api.get(`/produtos/listar/${id}`),
    deleteProd: (id) => api.get(`/produtos/listar/${id}`),
    updateProd: (id) => api.put(`/produtos/listar/${id}/rota`, data)
};

export const operadorService={
    loginOp: (data) => api.post('/operadores/login', data)
};

export default api;
