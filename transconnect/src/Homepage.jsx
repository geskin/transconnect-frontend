import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./UserContext";
import "./css/Homepage.css";

/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
    const { currUser } = useContext(UserContext);
    console.debug("Homepage", "currentUser=", currUser);

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="mb-4 fw-bold">TransConnect</h1>
                <p className="lead">Connection with a cause.</p>
                {currUser
                    ? <h2>
                        Welcome Back, {currUser.firstName || currUser.username}!
                    </h2>
                    : (
                        <p>
                            <button>
                                <Link className="btn btn-primary fw-bold me-3"
                                    to="/login">
                                    Log in
                                </Link>
                            </button>
                            <button>
                                <Link className="btn btn-primary fw-bold"
                                    to="/register">
                                    Sign up
                                </Link>
                            </button>
                        </p>
                    )}
            </div>
        </div>
    );
}

export default Homepage;