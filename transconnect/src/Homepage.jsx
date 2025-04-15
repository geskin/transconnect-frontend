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

    return (
        <div className="Homepage">
            <div className="container text-center">
                <h1 className="title mb-4 fw-bold">TransConnect</h1>
                <p className="lead">Connection with a cause.</p>
                {currUser
                    ? <h2>
                        Welcome Back, {currUser.username}!
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
                                <Link className="btn btn-primary fw-bold me-3"
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