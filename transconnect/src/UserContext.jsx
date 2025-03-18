import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        let storedUser = localStorage.getItem("currUser");
        if (storedUser === 'undefined' || storedUser === undefined || storedUser === null || storedUser === 'null') {
            return null;
        } else {
            return JSON.parse(storedUser);
        }
        // return storedUser ? JSON.parse(storedUser) : null;
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

