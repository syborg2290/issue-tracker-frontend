import React, { createContext, useState, useEffect } from "react";
import {
  getIssues,
  createIssue,
  updateIssue,
  findOne,
  setStatus,
  setPriority,
  setSeverity,
} from "../services/issueService";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Testing" | "Resolved" | "Closed";
  severity: "Low" | "Medium" | "High";
  priority: "Low" | "Medium" | "High";
  assignedTo: any;
  createdBy: any;
}

interface IssuesContextType {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  fetchIssues: () => void;
  addIssue: (issueData: Issue) => void;
  editIssue: (issueId: string, issueData: Partial<Issue>) => void;
  fetchIssue: (id: string) => void;
  updateStatus: (
    id: string,
    status: "Open" | "In Progress" | "Testing" | "Resolved" | "Closed"
  ) => void;
  updatePriority: (id: string, priority: "Low" | "Medium" | "High") => void;
  updateSeverity: (id: string, severity: "Low" | "Medium" | "High") => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export const IssuesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const fetchedIssues = await getIssues();
      setIssues(fetchedIssues);
      setError(null);
    } catch (err) {
      setError("Failed to fetch issues. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addIssue = async (issueData: Issue) => {
    try {
      const newIssue = await createIssue(issueData);
      setIssues([...issues, newIssue]);
      setError(null);
    } catch (err) {
      setError("Failed to create issue. Please try again.");
    }
  };

  const editIssue = async (issueId: string, issueData: Partial<Issue>) => {
    try {
      const updatedIssue = await updateIssue(issueId, issueData);
      const updatedIssues = issues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updatedIssue } : issue
      );
      setIssues(updatedIssues);
      setError(null);
    } catch (err) {
      setError("Failed to update issue. Please try again.");
    }
  };

  const fetchIssue = async (id: string) => {
    setLoading(true);
    try {
      const fetchedIssue = await findOne(id);
      if (fetchedIssue) {
        const updatedIssues = issues.map((issue) =>
          issue.id === id ? fetchedIssue : issue
        );
        setIssues(updatedIssues);
        setError(null);
      } else {
        setError(`Issue with ID ${id} not found.`);
      }
    } catch (err) {
      setError(`Failed to fetch issue with ID ${id}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: "Open" | "In Progress" | "Testing" | "Resolved" | "Closed"
  ) => {
    try {
      const updatedIssue = await setStatus(id, status);
      if (updatedIssue) {
        const updatedIssues = issues.map((issue) =>
          issue.id === id ? { ...issue, status: updatedIssue.status } : issue
        );
        setIssues(updatedIssues);
        setError(null);
      } else {
        setError(`Failed to update status for issue with ID ${id}.`);
      }
    } catch (err) {
      setError(
        `Failed to update status for issue with ID ${id}. Please try again.`
      );
    }
  };

  const updatePriority = async (
    id: string,
    priority: "Low" | "Medium" | "High"
  ) => {
    try {
      const updatedIssue = await setPriority(id, priority);
      if (updatedIssue) {
        const updatedIssues = issues.map((issue) =>
          issue.id === id
            ? { ...issue, priority: updatedIssue.priority }
            : issue
        );
        setIssues(updatedIssues);
        setError(null);
      } else {
        setError(`Failed to update priority for issue with ID ${id}.`);
      }
    } catch (err) {
      setError(
        `Failed to update priority for issue with ID ${id}. Please try again.`
      );
    }
  };

  const updateSeverity = async (
    id: string,
    severity: "Low" | "Medium" | "High"
  ) => {
    try {
      const updatedIssue = await setSeverity(id, severity);
      if (updatedIssue) {
        const updatedIssues = issues.map((issue) =>
          issue.id === id
            ? { ...issue, severity: updatedIssue.severity }
            : issue
        );
        setIssues(updatedIssues);
        setError(null);
      } else {
        setError(`Failed to update severity for issue with ID ${id}.`);
      }
    } catch (err) {
      setError(
        `Failed to update severity for issue with ID ${id}. Please try again.`
      );
    }
  };

  return (
    <IssuesContext.Provider
      value={{
        issues,
        loading,
        error,
        fetchIssues,
        addIssue,
        editIssue,
        fetchIssue,
        updateStatus,
        updatePriority,
        updateSeverity,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
};

export default IssuesContext;
