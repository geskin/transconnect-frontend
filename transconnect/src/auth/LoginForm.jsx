import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/** Login: displays login form and handles submission */

const LoginForm = ({ login }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = (evt) => {
        evt.preventDefault();
        login(formData.username, formData.password);
        setFormData({
            username: "",
            password: ""
        });
        navigate("/");
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Log In</h2>
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
                            <div className="d-grid">
                                <button className="btn btn-primary">
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;