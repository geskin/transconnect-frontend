import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/** SignupForm: displays signup form and handles submission */

const SignupForm = ({ signup }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    });
    const navigate = useNavigate();

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = evt => {
        evt.preventDefault();
        signup({ ...formData });
        setFormData({
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            email: ""
        });
        navigate("/");
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Sign Up</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={gatherInput}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="username"><b>Username</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    id="username"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="password"><b>Password</b></label>
                                <input
                                    onChange={handleChange}
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    id="password"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="email"><b>Email</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    id="email"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="pronouns"><b>Pronouns</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="pronouns"
                                    value={formData.pronouns}
                                    id="pronouns"
                                    className="form-control"
                                />
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;