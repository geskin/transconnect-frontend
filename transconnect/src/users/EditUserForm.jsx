import React, { useContext, useState } from "react";
import UserContext from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const EditUserForm = ({ editUser }) => {
    const { currUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: currUser.username,
        email: currUser.email,
        pronouns: currUser.pronouns,
        bio: currUser.bio,
        password: ""
    });
    const navigate = useNavigate();

    if (!currUser) return <Navigate to="/" />;

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = async (e) => {
        e.preventDefault();
        try {
            // Update user globally
            editUser(...formData);

            // Update the current user data in the form
            setFormData({
                username: currUser.username,
                email: currUser.email,
                pronouns: currUser.pronouns,
                bio: currUser.bio,
                password: ""
            });

            navigate(`/users/${currUser.username}`);
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Edit Profile</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={gatherInput}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="username"><b>Username</b></label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    id="username"
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
                            <div className="mb-3">
                                <label className="form-label" htmlFor="bio"><b>Bio</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="bio"
                                    value={formData.bio}
                                    id="bio"
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
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditUserForm;