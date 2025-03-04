import React, { useContext, useState } from "react";
import "./css/NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const AltNavBar = () => {
    const { currUser } = useContext(UserContext);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (e) => {
        setAnchorElNav(e.currentTarget);
    };
    const handleOpenUserMenu = (e) => {
        setAnchorElUser(e.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <NavLink exact="true" to="/">
                            TransConnect
                        </NavLink>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >

                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TransConnect
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            key="resources"
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Resources
                        </Button>
                        <Button
                            key="bathrooms"
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Bathrooms
                        </Button>
                        {currUser ? (
                            <>
                                <MenuItem key="resources">
                                    <NavLink to="/resources"><Typography sx={{ textAlign: 'center' }}>Resources</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="bathrooms">
                                    <NavLink to="/bathrooms"><Typography sx={{ textAlign: 'center' }}>Bathrooms</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="posts">
                                    <NavLink to="/posts"><Typography sx={{ textAlign: 'center' }}>Posts</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="profile">
                                    <NavLink to={`/users/${currUser.username}`}><Typography sx={{ textAlign: 'center' }}>Profile</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="logout">
                                    <NavLink to="/logout"><Typography sx={{ textAlign: 'center' }}>Logout</Typography></NavLink>
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem key="resources">
                                    <NavLink to="/resources"><Typography sx={{ textAlign: 'center' }}>Resources</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="bathrooms">
                                    <NavLink to="/bathrooms"><Typography sx={{ textAlign: 'center' }}>Bathrooms</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="bathrooms">
                                    <NavLink to="/login"><Typography sx={{ textAlign: 'center' }}>Login</Typography></NavLink>
                                </MenuItem>
                                <MenuItem key="bathrooms">
                                    <NavLink to="/register"><Typography sx={{ textAlign: 'center' }}>Signup</Typography></NavLink>
                                </MenuItem>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AltNavBar;
