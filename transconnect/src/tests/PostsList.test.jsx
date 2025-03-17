import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PostsList from "../posts/PostsList";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import PostCard from "../posts/PostCard";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../api");
vi.mock("../posts/PostCard", () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="post-card">PostCard</div>),
}));

describe("PostsList component", () => {
    const mockCurrUser = { username: "testuser", id: 1, role: "USER" };
    const mockUser = { username: "otheruser", id: 2 };
    const mockPosts = [
        { id: 101, title: "First Post", content: "This is a test post", user: { username: "user1" } },
        { id: 102, title: "Second Post", content: "This is another test post", user: { username: "user2" } },
    ];


    beforeEach(() => {
        TransconnectApi.getPosts.mockResolvedValue(mockPosts);
        TransconnectApi.getUser.mockResolvedValue(mockUser);
        TransconnectApi.getUserPosts.mockResolvedValue(mockPosts);
        TransconnectApi.deletePost.mockResolvedValue({});
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter initialEntries={["/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts" element={<PostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter initialEntries={["/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts" element={<PostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays user posts", async () => {
        render(
            <MemoryRouter initialEntries={["/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts" element={<PostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const postCards = screen.getAllByTestId("post-card");
            expect(postCards.length).toBeGreaterThan(0);
        });

    });

    it("displays message when no posts are found", async () => {
        TransconnectApi.getUserPosts.mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={["/posts"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/posts" element={<PostsList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Sorry, no results were found!")).to.exist;
        });
    });

    // it("handles post deletion", async () => {
    //     render(
    //         <MemoryRouter initialEntries={["/posts"]}>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <Routes>
    //                     <Route path="/posts" element={<PostsList />} />
    //                 </Routes>
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getByTestId("post-card")).to.exist;
    //     });

    //     // Simulate deleting a post
    //     fireEvent.click(screen.getAllByTestId("post-card")[0]);

    //     await waitFor(() => {
    //         expect(TransconnectApi.deletePost).toHaveBeenCalledWith(101);
    //         expect(screen.queryByTestId("post-card")).to.not.exist;
    //     });
    // });
});
