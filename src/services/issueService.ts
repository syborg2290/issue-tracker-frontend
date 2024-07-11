import apiService from './apiService';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Testing" | "Resolved" | "Closed";
  severity: "Low" | "Medium" | "High";
  priority: "Low" | "Medium" | "High";
  assignedTo: any;
  createdBy: any;
}

interface PaginatedData<T> {
  records: T[];
  currentPage: number;
  totalRecords: number;
  hasNextPage: boolean;
}

interface IssueResponse<T> {
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

const getIssues = async (): Promise<Issue[]> => {
  try {
    const response = await apiService.get('/v1/issues', { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<PaginatedData<Issue>> = response;
    return issueResponse.data.records;
  } catch (error) {
    handleApiError(error, 'Failed to fetch issues');
    return []; // Return an empty array in case of error
  }
};

const createIssue = async (issueData: Issue): Promise<Issue> => {
  try {
    const response = await apiService.post('/v1/issues', issueData, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, 'Failed to create issue');
    return {} as Issue; // Return an empty object cast to Issue type in case of error
  }
};

const updateIssue = async (issueId: string, issueData: Partial<Issue>): Promise<Issue> => {
  try {
    const response = await apiService.patch(`/v1/issues/${issueId}`, issueData, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, `Failed to update issue with ID ${issueId}`);
    return {} as Issue; // Return an empty object cast to Issue type in case of error
  }
};

const findOne = async (id: string): Promise<Issue | null> => {
  try {
    const response = await apiService.get(`/v1/issues/${id}`, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, `Failed to fetch issue with ID ${id}`);
    return null; // Return null in case of error
  }
};

const setStatus = async (id: string, status: 'Open' | 'In Progress' | 'Testing' | 'Resolved' | 'Closed'): Promise<Issue | null> => {
  try {
    const response = await apiService.patch(`/v1/issues/set-status/${id}?status=${status}`, {}, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, `Failed to update status for issue with ID ${id}`);
    return null; // Return null in case of error
  }
};

const setPriority = async (id: string, priority: "Low" | "Medium" | "High"): Promise<Issue | null> => {
  try {
    const response = await apiService.patch(`/v1/issues/set-priority/${id}?priority=${priority}`, {}, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, `Failed to update priority for issue with ID ${id}`);
    return null; // Return null in case of error
  }
};

const setSeverity = async (id: string, severity: "Low" | "Medium" | "High"): Promise<Issue | null> => {
  try {
    const response = await apiService.patch(`/v1/issues/set-severity/${id}?severity=${severity}`, {}, { headers: getAuthHeaders() });
    const issueResponse: IssueResponse<Issue> = response.data;
    return issueResponse.data;
  } catch (error) {
    handleApiError(error, `Failed to update severity for issue with ID ${id}`);
    return null; // Return null in case of error
  }
};

export {
  getIssues,
  createIssue,
  updateIssue,
  findOne,
  setStatus,
  setPriority,
  setSeverity,
};
