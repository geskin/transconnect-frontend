import { render, screen, fireEvent } from "@testing-library/react";
import { expect } from "chai";
import { describe, it, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";
import UserContext from "../UserContext";

describe("NavBar", () => {
    const renderNavBar = (currUser = null) => {
        return render(
            <BrowserRouter>
                <UserContext.Provider value={{ currUser, setCurrUser: vi.fn() }}>
                    <NavBar />
                </UserContext.Provider>
            </BrowserRouter>
        );
    };

    it("renders login and signup buttons when no user is logged in", () => {
        renderNavBar();

        expect(screen.getByText("Login")).to.not.be.null;
        expect(screen.getByText("Signup")).to.not.be.null;
    });

    it("renders profile and posts links when a user is logged in", () => {
        const user = { username: "testuser" };
        renderNavBar(user);

        expect(screen.getByText("Posts")).to.not.be.null;
        expect(screen.getByText("Profile")).to.not.be.null;
        expect(screen.getByText("Logout")).to.not.be.null;
    });

    it("navigates to the correct path when the navigation buttons are clicked", () => {
        const navigate = vi.fn();
        const user = { username: "testuser" };

        renderNavBar(user);
        const profileButton = screen.getAllByText("Profile")[0];
        fireEvent.click(profileButton);
        expect(navigate).toHaveBeenCalledWith(`/users/${user.username}`);

        const postsButton = screen.getAllByText("Posts")[0];
        fireEvent.click(postsButton);
        expect(navigate).toHaveBeenCalledWith("/posts");

        const logoutButton = screen.getAllByText("Logout")[0];
        fireEvent.click(logoutButton);
        expect(navigate).toHaveBeenCalledWith("/logout");
    });

    it("navigates to the login and signup buttons when no user is logged in", () => {
        const navigate = vi.fn();

        renderNavBar();

        const loginButton = screen.getAllByText("Login")[0];
        fireEvent.click(loginButton);
        expect(navigate).toHaveBeenCalledWith("/login");

        const signupButton = screen.getAllByText("Signup")[0];
        fireEvent.click(signupButton);
        expect(navigate).toHaveBeenCalledWith("/register");
    });

    it("renders all buttons correctly with a logged-in user", () => {
        const user = { username: "testuser" };
        renderNavBar(user);

        expect(screen.getAllByText("Resources")).to.not.be.null;
        expect(screen.getAllByText("Bathrooms")).to.not.be.null;
        expect(screen.getAllByText("Posts")).to.not.be.null;
        expect(screen.getAllByText("Profile")).to.not.be.null;
        expect(screen.getAllByText("Logout")).to.not.be.null;
    });

    it("renders all buttons correctly with no user logged in", () => {
        renderNavBar();

        expect(screen.getAllByText("Resources")).to.not.be.null;
        expect(screen.getAllByText("Bathrooms")).to.not.be.null;
        expect(screen.getAllByText("Login")).to.not.be.null;
        expect(screen.getAllByText("Signup")).to.not.be.null;
    });
});
