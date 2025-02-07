import React from "react";
import { Navigate } from "react-router-dom";

/** Logs user out */
const Logout = ({ logout }) => {
    logout();
    return <Navigate to="/" />;
}

export default Logout;