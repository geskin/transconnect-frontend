import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, TextField, Button, Box, FormControlLabel, Checkbox } from "@mui/material";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

/** EditPostForm: form for editing a post
 * 
 * auth required: admin or creator of post
 */
const EditPostForm = ({ editPost }) => {
    const { id } = useParams();
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [post, setPost] = useState({});
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: []
    });

    if (!currUser) return <Typography>Loading...</Typography>;

    useEffect(() => {
        console.debug("EditPostForm currUser debugging", currUser);

        const fetchPost = async () => {
            try {
                const post = await TransconnectApi.getPost(id);
                setFormData({
                    title: post.title || "",
                    content: post.content || "",
                    tags: post.tags || []
                });
                if (currUser.id !== post.userId && currUser.role !== "ADMIN") {
                    navigate("/posts");
                    return;
                }
                setPost(post);
            } catch (err) {
                console.error("Error fetching post", err);
            }
        };

        const fetchTags = async () => {
            try {
                const data = await TransconnectApi.getTags();
                setTags(data.map(t => t.name));
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        };

        fetchPost();
        fetchTags();

        console.debug("debugging post in edit post form", post);

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
            tags: fData.tags.includes(value)
                ? fData.tags.filter(t => t !== value)
                : [...fData.tags, value]
        }));
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            await editPost(id, formData, post.userId);
            navigate(`/posts/${id}`);
        } catch (err) {
            console.error("Error updating post:", err);
        }
    };

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Edit Post
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                            Tags:
                        </Typography>
                        {tags.map(t => (
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
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Post
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => navigate("/posts")}
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

export default EditPostForm;
