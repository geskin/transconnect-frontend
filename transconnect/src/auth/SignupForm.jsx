import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";

/** SignupForm: form for registering a new user and handles submission */

const SignupForm = ({ signup }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        pronouns: ""
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
            email: "",
            pronouns: ""
        });
        navigate("/");
    };

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={gatherInput}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
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
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Sign Up
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SignupForm;
