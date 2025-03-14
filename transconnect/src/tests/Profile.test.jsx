import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../users/Profile";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

vi.mock("../api");

const mockUser = {
    username: "testuser",
    pronouns: "they/them",
    bio: "This is a test bio.",
    email: "test@example.com",
    createdAt: "2025-03-14",
    role: "USER"
};

describe("Profile Component", () => {
    it("renders without crashing", async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockUser }}>
                    <Profile logout={vi.fn()} />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText("testuser")).toBeInTheDocument());
    });


    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockUser }}>
                    <Profile logout={vi.fn()} />
                </UserContext.Provider>
            </MemoryRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("shows user details", async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockUser }}>
                    <Profile logout={vi.fn()} />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeInTheDocument();
            expect(screen.getByText("they/them")).toBeInTheDocument();
            expect(screen.getByText("This is a test bio.")).toBeInTheDocument();
            expect(screen.getByText("test@example.com")).toBeInTheDocument();
        });
    });

    it("calls delete function on button click", async () => {
        window.confirm = vi.fn(() => true);
        TransconnectApi.deleteUser.mockResolvedValue({});
        const mockLogout = vi.fn();

        const mockUser = { username: "testuser", role: "USER" };

        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockUser }}>
                    <Profile logout={mockLogout} />
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Delete Profile"));

        fireEvent.click(screen.getByText("Delete Profile"));

        await waitFor(() => expect(mockLogout).toHaveBeenCalled());
    });
});
