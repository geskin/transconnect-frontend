import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";

function NavBar() {
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItems = [
        { label: "Resources", path: "/resources" },
        { label: "Bathrooms", path: "/bathrooms" },
        ...(currUser
            ? [
                { label: "Posts", path: "/posts" },
                { label: "Profile", path: `/users/${currUser.username}` },
                { label: "Logout", path: "/logout" },
            ]
            : [
                { label: "Login", path: "/login" },
                { label: "Signup", path: "/register" },
            ]),
    ];

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "whitesmoke",
                boxShadow: "0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px rgba(0,0,0,0.2)"
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
                <Typography
                    variant="h6"
                    noWrap
                    onClick={() => navigate("/")}
                    sx={{
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        letterSpacing: ".2rem",
                        textDecoration: "none",
                        paddingX: "20px",
                        cursor: "pointer",
                        background: "-webkit-linear-gradient(lightpink, lightblue)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    TransConnect
                </Typography>

                {isMobile ? (
                    <>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                            sx={{ color: "lightblue" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.label}
                                    onClick={() => {
                                        navigate(item.path);
                                        handleMenuClose();
                                    }}
                                >
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                ) : (
                    <Box sx={{ display: "flex", gap: 3, mr: 2 }}>
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    color: "lightblue",
                                    "&:hover": { color: "lightpink" }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
