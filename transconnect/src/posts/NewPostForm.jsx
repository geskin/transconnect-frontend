import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import UserContext from "../UserContext";
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

/** NewPostForm: form for submitting a new post 
 * 
 * Auth required: logged in
 */
const NewPostForm = ({ createPost }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: []
    });
    const [tags, setTags] = useState([]);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchTags = async () => {
            try {
                const data = await TransconnectApi.getTags();
                let tagList = data.map(t => t.name);
                setTags(tagList);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        };
        fetchTags();
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
            tags: formData.tags.includes(value)
                ? formData.tags.filter((t) => t !== value)
                : [...formData.tags, value]
        }));
    };

    const gatherInput = (e) => {
        e.preventDefault();
        console.debug("gathering input NewPostForm currUser:", currUser);
        createPost({ ...formData, userId: currUser.id });
        setFormData({ title: "", content: "", tags: [] });
        navigate("/posts");
    };

    return (
        <Box display="flex" justifyContent="center" mt={5}>
            <Card sx={{ width: 500, padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        New Post
                    </Typography>
                    <form onSubmit={gatherInput}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Content"
                            name="content"
                            multiline
                            rows={4}
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            Tags:
                        </Typography>
                        <FormGroup>
                            {tags.map((t) => (
                                <FormControlLabel
                                    key={t}
                                    control={
                                        <Checkbox
                                            checked={formData.tags.includes(t)}
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
                            Post!
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default NewPostForm;
