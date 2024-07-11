import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export default useUser;