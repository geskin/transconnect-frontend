import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";

/** NewResourceForm: form for submitting a new resource 
 * 
 * Auth required: logged in
 */
const NewResourceForm = ({ submitResource }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        url: "",
        types: []
    });
    const [types, setTypes] = useState([]);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchTypes = async () => {
            try {
                const data = await TransconnectApi.getTypes();
                let typeList = data.map(t => t.name);
                setTypes(typeList);
            } catch (err) {
                console.error("Error fetching resource types", err);
            }
        };
        fetchTypes();
    }, [currUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((formData) => ({
            ...formData,
            [name]: value
        }));
    };

    const handleCheckbox = (e) => {
        const { value } = e.target;
        setFormData((formData) => ({
            ...formData,
            types: formData.types.includes(value)
                ? formData.types.filter((t) => t !== value)
                : [...formData.types, value]
        }));
    };

    const gatherInput = (e) => {
        e.preventDefault();
        submitResource({ ...formData, userId: currUser.id });
        setFormData({ name: "", description: "", url: "", types: [] });
        navigate("/resources");
    };

    return (
        <Box display="flex" justifyContent="center" mt={5}>
            <Card sx={{ width: 500, padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        New Resource
                    </Typography>
                    <form onSubmit={gatherInput}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Resource Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="URL (if applicable)"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Resource Type:
                        </Typography>
                        <FormGroup>
                            {types.map((t) => (
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
                        </FormGroup>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default NewResourceForm;
