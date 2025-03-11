import React, { useContext, useState } from "react";
import UserContext from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

/** EditUserForm: displays form for updating user information and handles submission
 * 
 * auth required: correct user or admin
 */

const EditUserForm = ({ editUser }) => {
    const { currUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        username: currUser.username,
        email: currUser.email,
        pronouns: currUser.pronouns,
        bio: currUser.bio,
        password: "",
    });
    const navigate = useNavigate();

    if (!currUser) return <Navigate to="/" />;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value,
        }));
    };

    const gatherInput = async (e) => {
        e.preventDefault();
        try {
            if (!formData.password) {
                window.alert("You must enter your password to save changes.");
                return;
            } else {
                console.debug(formData);
                await editUser(formData);
                navigate(`/users/${currUser.username}`);
            }
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 500, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Edit Profile
                    </Typography>
                    <form onSubmit={gatherInput}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Pronouns"
                            name="pronouns"
                            value={formData.pronouns}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditUserForm;