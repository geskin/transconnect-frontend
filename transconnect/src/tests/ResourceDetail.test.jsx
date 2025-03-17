import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ResourceDetail from "../resources/ResourceDetail";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../api");

describe("ResourceDetail", () => {
    const mockCurrUser = { username: "testuser", id: 1, role: "USER" };
    const mockResource = {
        id: 101,
        name: "Test Resource",
        description: "This is a test resource.",
        url: "http://test.com",
        types: [{ name: "Hotline" }, { name: "Other" }],
        approved: false,
    };

    beforeEach(() => {
        TransconnectApi.getResource.mockResolvedValue(mockResource);
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter initialEntries={["/resources/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter initialEntries={["/resources/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays resource details", async () => {
        render(
            <MemoryRouter initialEntries={["/resources/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Test Resource").length).toBeGreaterThan(0);
        });
    });

    it("displays resource types correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/resources/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Hotline")).to.exist;
            expect(screen.getAllByText("Other")).to.exist;
        });
    });

    // it("handles resource approval toggle for admins", async () => {
    //     const mockAdminUser = { username: "admin", id: 2, role: "ADMIN" };
    //     const mockApprovedResource = { ...mockResource, approved: true };
    //     TransconnectApi.approve.mockResolvedValue(mockApprovedResource);

    //     render(
    //         <MemoryRouter initialEntries={["/resources/101"]}>
    //             <UserContext.Provider value={{ currUser: mockAdminUser }}>
    //                 <Routes>
    //                     <Route path="/resources/:id" element={<ResourceDetail />} />
    //                 </Routes>
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getAllByText("Test Resource")).to.exist;
    //     });

    //     fireEvent.click(screen.getByText("Approve"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.approve).toHaveBeenCalledWith(true, "101");
    //     });
    // });

    // it("handles resource deletion", async () => {
    //     TransconnectApi.deleteResource.mockResolvedValue({});

    //     render(
    //         <MemoryRouter initialEntries={["/resources/101"]}>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <Routes>
    //                     <Route path="/resources/:id" element={<ResourceDetail />} />
    //                 </Routes>
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     await waitFor(() => {
    //         expect(screen.getByText("Test Resource")).toBeInTheDocument();
    //     });

    //     fireEvent.click(screen.getByText("Delete"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.deleteResource).toHaveBeenCalledWith("101");
    //     });
    // });

    it("redirects to /resources when user does not have admin role", async () => {
        render(
            <MemoryRouter initialEntries={["/resources/101"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByText("Test Resource")).to.exist;
        });

        expect(screen.queryByText("Approve")).to.not.exist;
        expect(screen.queryByText("Delete")).to.not.exist;
    });
});
