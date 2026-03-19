import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('f7b_access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            const refreshToken = localStorage.getItem('f7b_refresh_token');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, null, {
                        headers: { Authorization: `Bearer ${refreshToken}` },
                    });
                    localStorage.setItem('f7b_access_token', data.accessToken);
                    localStorage.setItem('f7b_refresh_token', data.refreshToken);
                    original.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axiosInstance(original);
                } catch {
                    localStorage.removeItem('f7b_access_token');
                    localStorage.removeItem('f7b_refresh_token');
                    localStorage.removeItem('f7b_user');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
