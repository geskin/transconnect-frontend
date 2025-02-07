import { createContext, useState } from "react";

// Create a context for the current user
const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [currUser, setCurrUser] = useState(null);
    return (
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;
