import apiService from './apiService';

const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        let credentialsUpdated = { ...credentials };

        const response = await apiService.post('/v1/auth/email/login', credentialsUpdated);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getUserProfile = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await apiService.get(`/v1/auth/me`, { headers });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user profile');
    }
};

const authService = { loginUser, logoutUser, getUserProfile };

export default authService;
