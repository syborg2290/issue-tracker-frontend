import { useContext } from "react";
import IssuesContext from "../contexts/IssuesContext";

const useIssues = () => {
    const context = useContext(IssuesContext);
    if (!context) {
        throw new Error("useIssues must be used within an IssuesProvider");
    }
    return context;
};

export default useIssues;