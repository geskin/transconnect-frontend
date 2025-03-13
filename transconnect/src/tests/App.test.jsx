import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import UserContext from "../UserContext";
import { BrowserRouter } from "react-router-dom";
import TransconnectApi from "../api";
import { useLocalStorage } from "../hooks";
import { jwtDecode } from "jwt-decode";

vi.mock("../api");
vi.mock("../hooks", () => ({
    useLocalStorage: vi.fn(),
}));
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn(),
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

        await act(async () => {
            render(
                <UserContext.Provider value={{ currUser: { username: "testuser" }, setCurrUser: setCurrUserMock }}>
                    <App />
                </UserContext.Provider>
            );
        });

        expect(TransconnectApi.getUser).toHaveBeenCalledWith("testuser");
        expect(setCurrUserMock).toHaveBeenCalledWith(expect.objectContaining({ email: "test@example.com" }));
    });
});