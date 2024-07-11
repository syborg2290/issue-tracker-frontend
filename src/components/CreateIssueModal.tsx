import React, { useState } from "react";
import { Issue } from "../contexts/IssuesContext";
import useUser from "../hooks/useUser"; // Import the useUser hook

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newIssue: Issue;
  setNewIssue: (issue: Issue) => void;
  handleCreateIssue: () => void;
  statuses: ("Open" | "In Progress" | "Testing" | "Resolved" | "Closed")[];
}

const CreateIssueModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  newIssue,
  setNewIssue,
  handleCreateIssue,
  statuses,
}) => {
  const { users, loading, error } = useUser(); // Use the useUser hook to fetch users
  const allStatuses: (
    | "Open"
    | "In Progress"
    | "Testing"
    | "Resolved"
    | "Closed"
  )[] = ["Open", "In Progress", "Testing", "Resolved", "Closed"];
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssignedById, setSelectedAssignedById] = useState<string>("");

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    if (
      ["Open", "In Progress", "Testing", "Resolved", "Closed"].includes(
        e.target.value
      )
    ) {
      setNewIssue({
        ...newIssue,
        status: e.target.value as
          | "Open"
          | "In Progress"
          | "Testing"
          | "Resolved"
          | "Closed",
      });
    }
  };

  const handleAssignedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignedById(e.target.value);
    setNewIssue({
      ...newIssue,
      assignedTo: users.find((user) => user.id === e.target.value) || null,
    });
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${
        showModal ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Create New Issue
                </h3>
                <div className="mt-2">
                  <div>
                    <label
                      htmlFor="issue-title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="issue-title"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter issue title"
                        value={newIssue.title}
                        onChange={(e) =>
                          setNewIssue({ ...newIssue, title: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="issue-description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="issue-description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter issue description"
                        value={newIssue.description}
                        onChange={(e) =>
                          setNewIssue({
                            ...newIssue,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="issue-status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="issue-status"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        <option value="">Select Status</option>
                        {allStatuses.map((status: string) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="issue-assignedBy"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Assigned By
                    </label>
                    <div className="mt-1">
                      <select
                        id="issue-assignedBy"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2"
                        value={selectedAssignedById}
                        onChange={handleAssignedByChange}
                      >
                        <option value="">Select Assigned By</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {`${user.firstName} ${user.lastName}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => handleCreateIssue()}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setShowModal(false)}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;
