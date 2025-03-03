import React, { useContext } from "react";
import "./css/NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";

/** NavBar: typical navigation bar located at the top of each page of the app */

function NavBar() {
    const { currUser } = useContext(UserContext);

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