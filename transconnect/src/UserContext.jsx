import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(() => {
        let storedUser = localStorage.getItem("currUser");

        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Error parsing stored user:", error);
            return null;
        }
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

