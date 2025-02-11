import React, { useContext } from "react";
import "./css/NavBar.css";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserContext from "./UserContext";

function NavBar() {
    const { currUser } = useContext(UserContext);

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
                            <NavLink to={`/users/${currUser.username}`}>Your profile</NavLink>
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