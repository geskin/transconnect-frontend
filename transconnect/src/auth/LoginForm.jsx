import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";

/** LoginForm: form for user login and handles submission */

const LoginForm = ({ login }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = async (evt) => {
        evt.preventDefault();
        setError("");
        try {
            const success = await login(formData.username, formData.password);
            console.debug("success", success);
            if (success) {
                navigate("/");
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            console.error("Error authenticating user", err);
        }
    };

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Log In
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
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!error}
                            helperText={error ? "Invalid username or password" : ""}
                            sx={{ mb: 2 }}
                        />
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Log In
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginForm;
