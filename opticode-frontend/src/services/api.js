import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1/opticode';

export const parseCode = async (sourceCode, language) => {
    return await axios.post(`${API_BASE}/parse`, { sourceCode, language });
};

export const transpileCode = async (payload) => {
    return await axios.post(`${API_BASE}/transpile`, payload);
};

export const reviewCode = async (sourceCode, language) => {
    return await axios.post(`${API_BASE}/review`, { sourceCode, language });
};

export const getLogicFlow = async (sourceCode, language) => {
    return await axios.post(`${API_BASE}/logic-flow`, { sourceCode, language });
};

export const fixCode = async (sourceCode, language, findingsSummary) => {
    return await axios.post(`${API_BASE}/fix`, { sourceCode, language, findingsSummary });
};

export const analyzeAlgorithm = async (sourceCode, language) => {
    return await axios.post(`${API_BASE}/analyze`, { sourceCode, language });
};