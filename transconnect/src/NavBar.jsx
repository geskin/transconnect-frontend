import React from "react";
import "./css/NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

function NavBar({ currUser }) {
    return (
        <div>
            <Navbar expand="md">
                <NavLink exact="true" to="/" className="navbar-brand">
                    TransConnect
                </NavLink>
                {currUser ?
                    <Nav className="navbar-nav ms-auto" navbar>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/resources">Resources</NavLink>
                        </NavItem>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/posts">Posts</NavLink>
                        </NavItem>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/profile">Profile</NavLink>
                        </NavItem>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/logout">{`Logout ${currUser.username}`}</NavLink>
                        </NavItem>
                    </Nav>
                    :
                    <Nav className="navbar-nav ms-auto" navbar>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/login">Login</NavLink>
                        </NavItem>
                        <NavItem className="nav-item me-4">
                            <NavLink to="/register">Signup</NavLink>
                        </NavItem>
                    </Nav>
                }

            </Navbar>
        </div>
    );
}

export default NavBar;