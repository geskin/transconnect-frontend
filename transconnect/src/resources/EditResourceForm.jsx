import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Box, FormControlLabel, Checkbox } from "@mui/material";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

/** EditResourceForm: form for editing a resource
 * 
 * auth required: admin
 */
const EditResourceForm = ({ updateResource }) => {
    const { id } = useParams();
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        url: "",
        types: []
    });

    if (!currUser) return <Typography>Loading...</Typography>;

    useEffect(() => {
        if (!currUser || currUser.role !== "ADMIN") {
            navigate("/resources");
            return;
        }

        const fetchResource = async () => {
            try {
                const resource = await TransconnectApi.getResource(id);
                setFormData({
                    name: resource.name || "",
                    description: resource.description || "",
                    url: resource.url || "",
                    types: resource.types || []
                });
            } catch (err) {
                console.error("Error fetching resource", err);
            }
        };

        const fetchTypes = async () => {
            try {
                const data = await TransconnectApi.getTypes();
                setTypes(data.map(t => t.name));
            } catch (err) {
                console.error("Error fetching resource types", err);
            }
        };

        fetchResource();
        fetchTypes();
    }, [id, currUser, navigate]);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    const handleCheckbox = evt => {
        const value = evt.target.value;
        setFormData(fData => ({
            ...fData,
            types: fData.types.includes(value)
                ? fData.types.filter(t => t !== value)
                : [...fData.types, value]
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await updateResource(id, formData);
            navigate(`/resources/${id}`);
        } catch (err) {
            console.error("Error updating resource:", err);
        }
    };

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Edit Resource
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Resource Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="URL (if applicable)"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            Resource Type:
                        </Typography>
                        {types.map(t => (
                            <FormControlLabel
                                key={t}
                                control={
                                    <Checkbox
                                        checked={formData.types.includes(t)}
                                        onChange={handleCheckbox}
                                        value={t}
                                    />
                                }
                                label={t}
                            />
                        ))}
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Resource
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => navigate("/resources")}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditResourceForm;
