import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import PostCard from "./PostCard";
import { TextField, Button, Box } from "@mui/material";

/** PostsList: list of posts (in card form) made by users 
 * 
 * Auth required: logged in
 */

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchTag, setSearchTag] = useState("");
    const { currUser } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) navigate('/');

        const fetchPosts = async () => {
            try {
                const data = await TransconnectApi.getPosts();
                setPosts(data);
            } catch (err) {
                console.error("Error fetching posts", err);
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

        fetchPosts();
        fetchTags();
    }, [currUser]);

    const handleDeletePost = async (postId) => {
        try {
            await TransconnectApi.deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId)); // Update state for UI
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    const handleTagClick = async (e) => {
        e.preventDefault();
        const tag = e.target.value;

        setSearchTag(tag); // Update state for UI

        try {
            const data = await TransconnectApi.getPosts(tag ? [tag] : []);
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await TransconnectApi.getPosts([], searchTerm);
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    };

    return (
        <div>
            {/* Search Bar */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, p: 2 }}>
                <TextField
                    fullWidth
                    label="Search posts..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ maxWidth: 600 }}
                />
                <Button type="submit" variant="contained" onClick={handleSearchSubmit}>
                    Search
                </Button>
            </Box>

            {/* Filter Buttons */}
            <div>
                <Button value="" onClick={handleTagClick} variant="outlined">
                    X
                </Button>
                {tags.map((t) => (
                    <Button key={t} value={t} onClick={handleTagClick} variant="outlined" sx={{ m: 0.5 }}>
                        {t}
                    </Button>
                ))}
            </div>

            {/* Post Cards */}
            <div>
                {Array.isArray(posts) && posts.length > 0 ? (
                    posts.map((p) => (
                        <PostCard
                            key={p.id}
                            id={p.id}
                            title={p.title}
                            createdAt={p.createdAt}
                            editedAt={p.editedAt}
                            content={p.content}
                            user={p.user}
                            comments={p.comments}
                            tags={p.tags}
                            onDelete={handleDeletePost}
                        />
                    ))
                ) : (
                    <p className="lead white-letters">Sorry, no results were found!</p>
                )}
            </div>

            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button variant="contained" component={Link} to="/posts/new">
                    Say Something
                </Button>
            </Box>
        </div>
    );
};

export default PostsList;
