import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserPostsList from "../posts/UserPostsList";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import PostCard from "../posts/PostCard";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../api");
vi.mock("../posts/PostCard", () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="post-card">PostCard</div>),
}));

describe("UserPostsListc component", () => {
    const mockCurrUser = { username: "testuser", id: 1, role: "USER" };
    const mockUser = { username: "otheruser", id: 2 };
    const mockPosts = [
        {
            id: 101,
            title: "First Post",
            createdAt: "2024-03-14T12:00:00Z",
            editedAt: "2024-03-15T12:00:00Z",
            content: "This is a test post",
            user: { username: "otheruser" },
            comments: [],
            tags: [],
        },
    ];

    beforeEach(() => {
        TransconnectApi.getUser.mockResolvedValue(mockUser);
        TransconnectApi.getUserPosts.mockResolvedValue(mockPosts);
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter initialEntries={["/users/otheruser/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/users/:username/posts" element={<UserPostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter initialEntries={["/users/otheruser/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/users/:username/posts" element={<UserPostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays user posts", async () => {
        render(
            <MemoryRouter initialEntries={["/users/otheruser/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/users/:username/posts" element={<UserPostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("post-card")).toBeInTheDocument();
        });
    });

    it("displays message when no posts are found", async () => {
        TransconnectApi.getUserPosts.mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={["/users/otheruser/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/users/:username/posts" element={<UserPostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Sorry, no results were found!")).to.exist;
        });
    });

    it("handles post deletion", async () => {
        TransconnectApi.deletePost.mockResolvedValue({});
        render(
            <MemoryRouter initialEntries={["/users/otheruser/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/users/:username/posts" element={<UserPostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("post-card")).to.exist;
        });

        // Simulate deleting a post
        fireEvent.click(screen.getByTestId("post-card")); // Simulate clicking delete on a post card

        await waitFor(() => {
            expect(screen.queryByTestId("post-card")).to.not.exist;
        });
    });
});
