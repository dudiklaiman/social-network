import axios from 'axios';


const api = (token="", customHeaders = {}) => {
    const URL = import.meta.env.VITE_SERVER_URL;
    const defaultHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    const headers = { ...defaultHeaders, ...customHeaders };
    
    const axiosInstance = axios.create({
        baseURL: URL,
        headers: headers
    });
    return axiosInstance;
}

export default api;
