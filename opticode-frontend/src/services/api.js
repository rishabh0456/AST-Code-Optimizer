import axios from 'axios';

// Pointing to your Express Backend
const API_BASE = 'http://localhost:3000/api/v1/opticode';

export const parseCode = async (sourceCode, language) => {
    return await axios.post(`${API_BASE}/parse`, { sourceCode, language });
};

export const transpileCode = async (payload) => {
    return await axios.post(`${API_BASE}/transpile`, payload);
};