const API_BASE_URL = 'http://127.0.0.1:4000/api';

const post = async (endpoint: string, data: any, options?: { headers?: HeadersInit }) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

const get = async (endpoint: string, options?: { headers?: HeadersInit }) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

const patch = async (endpoint: string, data?: any, options?: { headers?: HeadersInit }) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
    } catch (error: any) {
        throw new Error(`Failed to fetch data: ${error.message}`);
    }
};

const apiService = { get, post, patch };

export default apiService;
