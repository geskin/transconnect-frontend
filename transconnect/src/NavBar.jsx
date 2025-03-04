import React, { useContext, useState } from "react";
import "./css/NavBar.css";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

/** NavBar: typical navigation bar located at the top of each page of the app */

function NavBar() {
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Container class="navbar" maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        class="navbar-brand"
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() => navigate('/')}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TransConnect
                    </Typography>



                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button key="resources" onClick={() => navigate('/resources')} sx={{ my: 2, color: 'white', display: 'block' }}>
                            <Typography class="nav-item" sx={{ textAlign: 'center' }}><a class=".nav-item">Resources</a></Typography>
                        </Button>

                        <Button key="bathrooms" onClick={() => navigate('/bathrooms')} sx={{ my: 2, color: 'white', display: 'block' }}>
                            <Typography class="nav-item" sx={{ textAlign: 'center' }}>Bathrooms</Typography>
                        </Button>

                        {currUser ? (
                            <>
                                <Button key="posts" onClick={() => navigate('/posts')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    <Typography class="nav-item" sx={{ textAlign: 'center' }}>Posts</Typography>
                                </Button>

                                <Button key="profile" onClick={() => navigate(`/users/${currUser.username}`)} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    <Typography class="nav-item" sx={{ textAlign: 'center' }}>Profile</Typography>
                                </Button>

                                <Button key="logout" onClick={() => navigate('/logout')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    <Typography class="nav-item" sx={{ textAlign: 'center' }}>Logout</Typography>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button key="login" onClick={() => navigate('/login')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    <Typography class="nav-item" sx={{ textAlign: 'center' }}>Login</Typography>
                                </Button>

                                <Button key="signup" onClick={() => navigate('/register')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                    <Typography class="nav-item" sx={{ textAlign: 'center' }}>Signup</Typography>
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );

    return (
        <div>
            <Navbar expand="md" className="d-flex align-items-center justify-content-between px-3">
                <NavLink exact="true" to="/" className="navbar-brand nav-item">
                    TransConnect
                </NavLink>
                <Nav className="ms-auto d-flex flex-row" navbar>
                    {currUser ? (
                        <>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/resources">Resources</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/bathrooms">Bathrooms</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/posts">Posts</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to={`/users/${currUser.username}`}>Your profile</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/logout">{`Logout ${currUser.username}`}</NavLink>
                            </NavItem>
                        </>
                    ) : (
                        <>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/resources">Resources</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/bathrooms">Bathrooms</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/login">Login</NavLink>
                            </NavItem>
                            <NavItem className="nav-item me-4">
                                <NavLink to="/register">Signup</NavLink>
                            </NavItem>
                        </>
                    )}
                </Nav>
            </Navbar>
        </div>
    );


}

export default NavBar;