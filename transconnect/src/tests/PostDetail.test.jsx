import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PostDetail from "../posts/PostDetail";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CommentsBottomNavigation from "../utils/bottomNav";

vi.mock("../api");
vi.mock("../utils/bottomNav", () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="comments-nav">CommentsNavigation</div>),
}));

describe("PostDetail", () => {
    const mockCurrUser = { username: "testuser", id: 1, role: "USER" };
    const mockPost = {
        id: 101,
        title: "Test Post",
        createdAt: "2024-03-14T12:00:00Z",
        content: "This is a test post content.",
        tags: [{ name: "React" }, { name: "Vitest" }],
        user: { username: "otheruser" },
    };

    beforeEach(() => {
        TransconnectApi.getPost.mockResolvedValue(mockPost);
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter initialEntries={["/posts/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts/:id" element={<PostDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter initialEntries={["/posts/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts/:id" element={<PostDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays post details", async () => {
        render(
            <MemoryRouter initialEntries={["/posts/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts/:id" element={<PostDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Post")).toBeInTheDocument();
            expect(screen.getByText("This is a test post content.")).toBeInTheDocument();
        });

        expect(screen.getByTestId("comments-nav")).toBeInTheDocument();
    });

    it("displays tags correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/posts/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts/:id" element={<PostDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("React")).toBeInTheDocument();
            expect(screen.getByText("Vitest")).toBeInTheDocument();
        });
    });

    it("handles post deletion", async () => {
        TransconnectApi.deletePost.mockResolvedValue({});

        render(
            <MemoryRouter initialEntries={["/posts/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts/:id" element={<PostDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test Post")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Delete"));

        await waitFor(() => {
            expect(TransconnectApi.deletePost).toHaveBeenCalledWith("101");
        });
    });
});
