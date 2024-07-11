import apiService from './apiService';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface PaginatedData<T> {
    records: T[];
    currentPage: number;
    totalRecords: number;
    hasNextPage: boolean;
}

interface ApiResponse<T> {
    data: T;
    statusCode: number;
    message: string;
}

// Helper function to get the authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Error handling function
const handleApiError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error.response?.data || error.message);
    throw new Error(`${defaultMessage}: ${error.response?.data?.message || 'Unknown error'}`);
};

const getUsers = async (): Promise<User[]> => {
    try {
        const response = await apiService.get('/v1/users', { headers: getAuthHeaders() });
        const apiResponse: ApiResponse<PaginatedData<User>> = response;
        return apiResponse.data.records;
    } catch (error) {
        handleApiError(error, 'Failed to fetch users');
        return []; // Return an empty array in case of error
    }
};

const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const response = await apiService.get(`/v1/users/${userId}`, { headers: getAuthHeaders() });
        const apiResponse: ApiResponse<User> = response;
        return apiResponse.data;
    } catch (error) {
        handleApiError(error, `Failed to fetch user with ID ${userId}`);
        return null; // Return null in case of error
    }
};

const createUser = async (userData: Partial<User>): Promise<User> => {
    try {
        const response = await apiService.post('/v1/users', userData, { headers: getAuthHeaders() });
        const apiResponse: ApiResponse<User> = response;
        return apiResponse.data;
    } catch (error) {
        handleApiError(error, 'Failed to create user');
        return {} as User; // Return an empty object cast to User type in case of error
    }
};

const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
    try {
        const response = await apiService.patch(`/v1/users/${userId}`, userData, { headers: getAuthHeaders() });
        const apiResponse: ApiResponse<User> = response;
        return apiResponse.data;
    } catch (error) {
        handleApiError(error, `Failed to update user with ID ${userId}`);
        return {} as User; // Return an empty object cast to User type in case of error
    }
};


export {
    getUsers,
    getUserById,
    createUser,
    updateUser,
};
