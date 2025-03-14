import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import { useLocalStorage } from "../hooks";
import { jwtDecode } from "jwt-decode";

vi.mock("../api");
vi.mock("../hooks", () => ({
    useLocalStorage: vi.fn(),
}));
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn(() => ({ username: "testuser", role: "USER" })),
}));

beforeEach(() => {
    useLocalStorage.mockReturnValue(["test-token", vi.fn()]);
    TransconnectApi.getUser = vi.fn();
    TransconnectApi.getUser.mockResolvedValue({ email: "test@example.com" });
});

describe("App Component", () => {
    it("renders without crashing", () => {
        render(
            <UserContext.Provider value={{ currUser: null, setCurrUser: vi.fn() }}>
                <App />
            </UserContext.Provider>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <UserContext.Provider value={{ currUser: null, setCurrUser: vi.fn() }}>
                <App />
            </UserContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("sets token globally when present", async () => {
        render(
            <UserContext.Provider value={{ currUser: null, setCurrUser: vi.fn() }}>
                <App />
            </UserContext.Provider>
        );
        expect(TransconnectApi.token).toBe("test-token");
    });

    it("decodes token and sets current user", async () => {
        const setCurrUserMock = vi.fn();
        jwtDecode.mockReturnValue({ username: "testuser", role: "USER" });

        render(
            <UserContext.Provider value={{ currUser: null, setCurrUser: setCurrUserMock }}>
                <App />
            </UserContext.Provider>
        );

        expect(setCurrUserMock).toHaveBeenCalledWith({ username: "testuser", role: "USER" });
    });

    it("fetches additional user data when currUser is set", async () => {
        const setCurrUserMock = vi.fn();

        TransconnectApi.getUser.mockResolvedValue({ email: "test@example.com" });

        await act(async () => {
            render(
                <UserContext.Provider value={{ currUser: { username: "testuser" }, setCurrUser: setCurrUserMock }}>
                    <App />
                </UserContext.Provider>
            );
        });

        await waitFor(() => {
            expect(TransconnectApi.getUser).toHaveBeenCalledWith("testuser");
        });

        expect(setCurrUserMock).toHaveBeenCalledTimes(2);

        expect(setCurrUserMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
            username: "testuser",
            role: "USER"
        }));

        const callback = setCurrUserMock.mock.calls[1][0];
        expect(typeof callback).toBe("function");

        const updatedUser = callback({ username: "testuser", role: "USER" });
        expect(updatedUser).toEqual(expect.objectContaining({
            username: "testuser",
            email: "test@example.com",
            role: "USER"
        }));
    });
});