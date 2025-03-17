import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CommentsBottomNavigation from "../utils/bottomNav";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

vi.mock("../api", () => ({
    default: {
        getComments: vi.fn(),
        createComment: vi.fn(),
        deleteComment: vi.fn(),
        editComment: vi.fn(),
        getComment: vi.fn()
    }
}));

describe("CommentsBottomNavigation Component", () => {
    const mockUser = {
        id: 1,
        username: "testuser",
        role: "USER"
    };
    const mockComments = [
        { id: 1, content: "First comment", createdAt: "2024-03-14T12:00:00Z", author: { username: "testuser" } },
        { id: 2, content: "Second comment", createdAt: "2024-03-14T13:00:00Z", author: { username: "anotheruser" } }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(
            <UserContext.Provider value={{ currUser: mockUser }}>
                <CommentsBottomNavigation postId={123} />
            </UserContext.Provider>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <UserContext.Provider value={{ currUser: mockUser }}>
                <CommentsBottomNavigation postId={123} />
            </UserContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays comments", async () => {
        TransconnectApi.getComments.mockResolvedValue(mockComments);

        render(
            <UserContext.Provider value={{ currUser: mockUser }}>
                <CommentsBottomNavigation postId={123} />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(TransconnectApi.getComments).toHaveBeenCalledWith(123);
        });
    });

    // it("adds a comment when submitted", async () => {
    //     TransconnectApi.getComments.mockResolvedValue([]);
    //     TransconnectApi.createComment.mockResolvedValue({
    //         id: 3,
    //         content: "New comment",
    //         createdAt: "2024-03-14T14:00:00Z",
    //         author: { username: "testuser" }
    //     });

    //     render(
    //         <UserContext.Provider value={{ currUser: mockUser }}>
    //             <CommentsBottomNavigation postId={123} />
    //         </UserContext.Provider>
    //     );

    //     fireEvent.click(screen.getByText("Comment"));
    //     fireEvent.change(screen.getByText("Add a comment..."), { target: { value: "New comment" } });
    //     fireEvent.click(screen.getByText("Submit"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.createComment).toHaveBeenCalledWith(123, "New comment", mockUser.id);
    //     });
    // });

    // it("deletes a comment when the delete button is clicked", async () => {
    //     TransconnectApi.getComments.mockResolvedValue(mockComments);
    //     TransconnectApi.getComment.mockResolvedValue(mockComments[0]);
    //     TransconnectApi.deleteComment.mockResolvedValue(true);

    //     render(
    //         <UserContext.Provider value={{ currUser: mockUser }}>
    //             <CommentsBottomNavigation postId={123} />
    //         </UserContext.Provider>
    //     );

    //     await waitFor(() => expect(screen.getByText("First comment")).toBeInTheDocument());

    //     fireEvent.click(screen.getAllByLabelText("delete")[0]);

    //     await waitFor(() => {
    //         expect(TransconnectApi.deleteComment).toHaveBeenCalledWith(123, 1, mockComments[0], "testuser");
    //         expect(screen.queryByText("First comment")).not.toBeInTheDocument();
    //     });
    // });

    // it("allows a user to edit their own comment", async () => {
    //     TransconnectApi.getComments.mockResolvedValue(mockComments);
    //     TransconnectApi.editComment.mockResolvedValue({ content: "Updated comment" });

    //     render(
    //         <UserContext.Provider value={{ currUser: mockUser }}>
    //             <CommentsBottomNavigation postId={123} />
    //         </UserContext.Provider>
    //     );

    //     fireEvent.click(screen.getAllByLabelText("edit")[0]);

    //     fireEvent.change(screen.getByDisplayValue("First comment"), { target: { value: "Updated comment" } });

    //     fireEvent.click(screen.getByLabelText("save"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.editComment).toHaveBeenCalledWith(123, 1, "Updated comment", "testuser");
    //         expect(screen.getByText("Updated comment")).toBeInTheDocument();
    //     });
    // });
});
