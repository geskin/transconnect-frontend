import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import PostCard from "../posts/PostCard";

vi.mock("../api");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("PostCard", () => {
    const mockDeletePost = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        TransconnectApi.getPost.mockResolvedValue({
            id: 101,
            title: "Test Post",
            createdAt: "2024-03-14T12:00:00Z",
            content: "This is a test post.",
            user: { username: "testuser" },
            tags: [{ name: "React" }, { name: "Vitest" }],
        });

        TransconnectApi.deletePost.mockResolvedValue({});
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    const mockCurrUser = { username: "testuser", role: "USER" };
    const mockAdminUser = { username: "admin", role: "ADMIN" };

    it("renders without crashing", () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <PostCard
                        id={101}
                        title="Test Post"
                        createdAt="2024-03-14T12:00:00Z"
                        content="This is a test post."
                        user={{ username: "testuser" }}
                        tags={[{ name: "React" }, { name: "Vitest" }]}
                        onDelete={mockDeletePost}
                    />
                </UserContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText("@testuser")).to.exist;
        expect(screen.getByText("Test Post")).to.exist;
        expect(screen.getByText("This is a test post.")).to.exist;
        expect(screen.getByText("React")).to.exist;
        expect(screen.getByText("Vitest")).to.exist;
    });

    // it("allows an admin to delete a post", async () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockAdminUser }}>
    //                 <PostCard
    //                     id={101}
    //                     title="Test Post"
    //                     createdAt="2024-03-14T12:00:00Z"
    //                     content="This is a test post."
    //                     user={{ username: "testuser" }}
    //                     tags={[{ name: "React" }, { name: "Vitest" }]}
    //                     onDelete={mockDeletePost}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getByText("Delete"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.getPost).toHaveBeenCalledWith(101);
    //         expect(TransconnectApi.deletePost).toHaveBeenCalledWith(101, {
    //             id: 101,
    //             title: "Test Post",
    //             createdAt: "2024-03-14T12:00:00Z",
    //             content: "This is a test post.",
    //             user: { username: "testuser" },
    //             tags: [{ name: "React" }, { name: "Vitest" }],
    //         });
    //         expect(mockDeletePost).toHaveBeenCalledWith(101);
    //     });
    // });

    // it("redirects to edit page when clicking Edit", () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <PostCard
    //                     id={101}
    //                     title="Test Post"
    //                     createdAt="2024-03-14T12:00:00Z"
    //                     content="This is a test post."
    //                     user={{ username: "testuser" }}
    //                     tags={[{ name: "React" }, { name: "Vitest" }]}
    //                     onDelete={mockDeletePost}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getByText("Edit"));
    //     expect(mockNavigate).toHaveBeenCalledWith("/posts/101/edit");
    // });

    // it("redirects to post details when clicking View Comments", () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <PostCard
    //                     id={101}
    //                     title="Test Post"
    //                     createdAt="2024-03-14T12:00:00Z"
    //                     content="This is a test post."
    //                     user={{ username: "testuser" }}
    //                     tags={[{ name: "React" }, { name: "Vitest" }]}
    //                     onDelete={mockDeletePost}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getByText("View Comments"));
    //     expect(mockNavigate).toHaveBeenCalledWith("/posts/101");
    // });
});
