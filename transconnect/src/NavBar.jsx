import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";

/** NavBar: Full-width navigation bar at the top of the app */

function NavBar() {
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: "whitesmoke", boxShadow: "0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px rgba(0,0,0,0.2)" }}
        >
            <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
                <Typography
                    variant="h6"
                    noWrap
                    onClick={() => navigate('/')}
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        letterSpacing: ".2rem",
                        textDecoration: "none",
                        paddingX: "20px",
                        cursor: "pointer",
                        background: "-webkit-linear-gradient(lightpink, lightblue)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    TransConnect
                </Typography>

                {/* Nav Links */}
                <Box sx={{ display: "flex", gap: 3, mr: 2 }}>
                    <Button onClick={() => navigate('/resources')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Resources</Button>
                    <Button onClick={() => navigate('/bathrooms')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Bathrooms</Button>

                    {currUser ? (
                        <>
                            <Button onClick={() => navigate('/posts')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Posts</Button>
                            <Button onClick={() => navigate(`/users/${currUser.username}`)} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Profile</Button>
                            <Button onClick={() => navigate('/logout')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Login</Button>
                            <Button onClick={() => navigate('/register')} sx={{ color: "lightblue", "&:hover": { color: "lightpink" } }}>Signup</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
