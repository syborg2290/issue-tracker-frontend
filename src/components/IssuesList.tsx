import React, { useState } from "react";
import { Issue } from "../contexts/IssuesContext";
import useIssues from "../hooks/useIssues";
import { statusColorMap } from "../utils/statusColorMap";
import { useNavigate } from "react-router-dom";
import CreateIssueModal from "./CreateIssueModal";
import EditIssueModal from "./EditIssueModal";

const IssuesList: React.FC = () => {
  const navigate = useNavigate();
  const {
    issues,
    loading,
    error,
    fetchIssues,
    addIssue,
    editIssue,
    updateStatus,
  } = useIssues();

  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newIssue, setNewIssue] = useState<Issue>({
    id: "",
    title: "",
    description: "",
    status: "Open",
    severity: "Low",
    priority: "Low",
    assignedTo: null,
    createdBy: null,
  });

  const handleCreateIssue = async () => {
    try {
      await addIssue(newIssue);
      setShowCreateModal(false);
      setNewIssue({
        id: "",
        title: "",
        description: "",
        status: "Open",
        severity: "Low",
        priority: "Low",
        assignedTo: null,
        createdBy: null,
      });
    } catch (err) {
      console.error("Failed to create issue:", err);
      // Handle error (e.g., show error message)
    }
  };

  const handleEditIssue = async () => {
    if (selectedIssue) {
      try {
        await editIssue(selectedIssue.id, selectedIssue);
        setShowEditModal(false);
      } catch (err) {
        console.error("Failed to edit issue:", err);
        // Handle error (e.g., show error message)
      }
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "Open" | "In Progress" | "Testing" | "Resolved" | "Closed"
  ) => {
    try {
      await updateStatus(id, status);
      // Optionally fetch issues again or update local state
    } catch (err) {
      console.error("Failed to update status:", err);
      // Handle error (e.g., show error message)
    }
  };

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const openEditModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setShowEditModal(true);
  };

  type IssueStatus = "Open" | "In Progress" | "Testing" | "Resolved" | "Closed";

  const getNextStatus: (currentStatus: IssueStatus) => IssueStatus = (
    currentStatus
  ) => {
    switch (currentStatus) {
      case "Open":
        return "In Progress";
      case "In Progress":
        return "Testing";
      case "Testing":
        return "Resolved";
      case "Resolved":
        return "Closed";
      case "Closed":
        return "Closed";
      default:
        return "Open";
    }
  };

  return (
    <div className="container mx-auto mt-10">
      {/* Navbar with User Avatar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Issues List</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
              aria-label="Account"
              onClick={() => {
                navigate("/profile");
              }}
            >
              <img
                className="h-8 w-8 rounded-full"
                src="https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?size=338&ext=jpg&ga=GA1.1.1546980028.1702857600&semt=sph"
                alt="User Avatar"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Create Issue Modal */}
      <CreateIssueModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        newIssue={newIssue}
        setNewIssue={setNewIssue}
        handleCreateIssue={handleCreateIssue}
        statuses={["Open", "In Progress", "Testing", "Resolved", "Closed"]}
      />

      {/* Edit Issue Modal */}
      <EditIssueModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedIssue={selectedIssue}
        setSelectedIssue={setSelectedIssue}
        handleEditIssue={handleEditIssue}
      />

      {/* Issue List */}
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 w-72 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M13.293 14.707a1 1 0 0 1-1.414 1.414l-3.5-3.5a1 1 0 0 1 0-1.414l3.5-3.5a1 1 0 1 1 1.414 1.414L10.414 11l2.879 2.879z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowCreateModal(true)}
          >
            Create Issue
          </button>
        </div>

        {/* Issues Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortBy === "id" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Title
                  {sortBy === "title" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortBy === "status" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-red-500">
                    Error: Failed to load issues.
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No issues to display.
                  </td>
                </tr>
              ) : (
                <>
                  {issues.map((issue) => (
                    <tr key={issue.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {issue.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${
                            statusColorMap[issue.status]
                          }-100 text-${statusColorMap[issue.status]}-800`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          onClick={() => openEditModal(issue)}
                        >
                          Edit
                        </button>
                        <button
                          className={`text-${
                            statusColorMap[issue.status]
                          }-600 hover:text-${statusColorMap[issue.status]}-900`}
                          onClick={() =>
                            handleUpdateStatus(
                              issue.id,
                              getNextStatus(issue.status)
                            )
                          }
                        >
                          {getNextStatus(issue.status)}
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssuesList;
