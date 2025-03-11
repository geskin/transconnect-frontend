import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, Typography, Button, Box, CardActions } from "@mui/material";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import { formatDate } from "../utils/formatDate";

const Profile = ({ logout }) => {
    const { username } = useParams();
    const { currUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    if (!username || !currUser) return <Typography>Loading...</Typography>;

    const deleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await TransconnectApi.deleteUser(username, user);
                logout();
                navigate("/");
            } catch (err) {
                console.error("Error deleting user:", err);
            }
        }
    };

    useEffect(() => {
        if (!currUser) navigate("/");
        if (username !== currUser.username) {
            const fetchUser = async () => {
                try {
                    const user = await TransconnectApi.getUser(username);
                    setUser(user);
                } catch (err) {
                    console.error("Error fetching user info", err);
                }
            };
            fetchUser();
        }
    }, [username, currUser, navigate]);

    const displayedUser = username === currUser.username ? currUser : user;

    return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Card sx={{ width: 500, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {displayedUser?.username}
                    </Typography>
                    {displayedUser?.pronouns && (
                        <Typography variant="subtitle1" color="text.secondary">
                            {displayedUser.pronouns}
                        </Typography>
                    )}
                    {displayedUser?.bio && (
                        <Typography variant="body1" mt={1}>
                            {displayedUser.bio}
                        </Typography>
                    )}
                    {displayedUser?.email && (username === currUser.username || currUser.role === 'ADMIN') && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            {displayedUser.email}
                        </Typography>
                    )}
                    <Typography variant="caption" display="block" mt={2}>
                        Created on: {formatDate(displayedUser?.createdAt)}
                    </Typography>
                </CardContent>

                <CardActions>
                    {(username === currUser.username || currUser.role === 'ADMIN') && (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                component={Link}
                                to={`/users/${username}/edit`}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ mt: 2, ml: 2 }}
                                onClick={deleteProfile}
                            >
                                Delete Profile
                            </Button>
                        </div>
                    )}
                    <Button onClick={() => navigate(`/users/${username}/posts`)} size="small">Posts</Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default Profile;
