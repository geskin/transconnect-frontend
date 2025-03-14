import { render, screen } from "@testing-library/react";
import { describe, it, beforeEach } from "vitest";
import { expect } from "chai";
import UserContext from "../UserContext";
import Homepage from "../Homepage";

beforeEach(() => {
    const mockUserContext = { currUser: null };
});

describe("Homepage component", () => {

    //causes error: "TypeError: Cannot destructure property 'basename' of 'React10.useContext(...)' as it is null."
    it("renders login/register buttons when no user is logged in", () => {
        render(
            <UserContext.Provider value={{ currUser: null }}>
                <Homepage />
            </UserContext.Provider>
        );

        expect(screen.getByText("Log in")).to.not.be.null;
        expect(screen.getByText("Sign up")).to.not.be.null;
    });

    it("displays welcome message when user is logged in", () => {
        const user = { username: "testuser" };
        render(
            <UserContext.Provider value={{ currUser: user }}>
                <Homepage />
            </UserContext.Provider>
        );

        expect(screen.getByText(`Welcome Back, ${user.username}!`)).to.not.be.null;
    });
});
