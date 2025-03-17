import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import ResourceCard from "../resources/ResourceCard";

vi.mock("../api");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("ResourceCard", () => {
    const mockDeleteResource = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        TransconnectApi.getResource.mockResolvedValue({
            id: 201,
            name: "Test Resource",
            description: "This is a test resource.",
            url: "https://example.com",
            types: [{ name: "Type1" }, { name: "Type2" }],
            userId: 123,
            approved: false,
        });

        TransconnectApi.deleteResource.mockResolvedValue({});
        TransconnectApi.approve.mockResolvedValue({});
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
                    <ResourceCard
                        id={201}
                        name="Test Resource"
                        description="This is a test resource."
                        url="https://example.com"
                        types={[{ name: "Type1" }, { name: "Type2" }]}
                        userId={123}
                        approved={false}
                        onDelete={mockDeleteResource}
                    />
                </UserContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText("Test Resource")).to.exist;
        expect(screen.getByText("This is a test resource.")).to.exist;
        expect(screen.getByText("Type1")).to.exist;
        expect(screen.getByText("Type2")).to.exist;
    });

    it("allows an admin to approve a resource", async () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ currUser: mockAdminUser }}>
                    <ResourceCard
                        id={201}
                        name="Test Resource"
                        description="This is a test resource."
                        url="https://example.com"
                        types={[{ name: "Type1" }, { name: "Type2" }]}
                        userId={123}
                        approved={false}
                        onDelete={mockDeleteResource}
                    />
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Approve"));

        await waitFor(() => {
            expect(TransconnectApi.approve).toHaveBeenCalledWith(true, 201);
        });
    });

    // it("allows an admin to delete a resource", async () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockAdminUser }}>
    //                 <ResourceCard
    //                     id={201}
    //                     name="Test Resource"
    //                     description="This is a test resource."
    //                     url="https://example.com"
    //                     types={[{ name: "Type1" }, { name: "Type2" }]}
    //                     userId={123}
    //                     approved={false}
    //                     onDelete={mockDeleteResource}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getByText("Delete"));

    //     await waitFor(() => {
    //         expect(TransconnectApi.getResource).toHaveBeenCalledWith(201);
    //         expect(TransconnectApi.deleteResource).toHaveBeenCalledWith(201, {
    //             id: 201,
    //             name: "Test Resource",
    //             description: "This is a test resource.",
    //             url: "https://example.com",
    //             types: [{ name: "Type1" }, { name: "Type2" }],
    //             userId: 123,
    //             approved: false,
    //         });
    //         expect(mockDeleteResource).toHaveBeenCalledWith(201);
    //     });
    // });

    // it("redirects to edit page when clicking Edit", () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <ResourceCard
    //                     id={201}
    //                     name="Test Resource"
    //                     description="This is a test resource."
    //                     url="https://example.com"
    //                     types={[{ name: "Type1" }, { name: "Type2" }]}
    //                     userId={123}
    //                     approved={false}
    //                     onDelete={mockDeleteResource}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getAllByText("Edit"));
    //     expect(mockNavigate).toHaveBeenCalledWith("/resources/201/edit");
    // });

    // it("redirects to resource details when clicking Details", () => {
    //     render(
    //         <MemoryRouter>
    //             <UserContext.Provider value={{ currUser: mockCurrUser }}>
    //                 <ResourceCard
    //                     id={201}
    //                     name="Test Resource"
    //                     description="This is a test resource."
    //                     url="https://example.com"
    //                     types={[{ name: "Type1" }, { name: "Type2" }]}
    //                     userId={123}
    //                     approved={false}
    //                     onDelete={mockDeleteResource}
    //                 />
    //             </UserContext.Provider>
    //         </MemoryRouter>
    //     );

    //     fireEvent.click(screen.getByText("Details"));
    //     expect(mockNavigate).toHaveBeenCalledWith("/resources/201");
    // });
});
