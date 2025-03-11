import { createContext, useState, useEffect } from "react";

// Create a context for the current user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        // Load from localStorage when the app starts
        const storedUser = localStorage.getItem("currUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Save to localStorage whenever currUser changes
    useEffect(() => {
        if (currUser) {
            localStorage.setItem("currUser", JSON.stringify(currUser));
        } else {
            localStorage.removeItem("currUser");
        }
    }, [currUser]);

    return (
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

