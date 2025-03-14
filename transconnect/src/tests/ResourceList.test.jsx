import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ResourceList from "../resources/ResourceList";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../api");
vi.mock("../resources/ResourceCard", () => ({
    __esModule: true,
    default: vi.fn(() => <div data-testid="resource-card">ResourceCard</div>),
}));

describe("ResourceList component", () => {
    const mockCurrUser = { username: "testuser", id: 1, role: "USER" };
    const mockUser = { username: "otheruser", id: 2 };
    const mockResources = [
        { id: 101, name: "Resource One", description: "First resource", approved: true, userId: 1, types: ["Type1"] },
        { id: 102, name: "Resource Two", description: "Second resource", approved: true, userId: 2, types: ["Type2"] },
    ];
    const mockTypes = ["Type1", "Type2"];

    beforeEach(() => {
        TransconnectApi.getResources.mockResolvedValue(mockResources);
        TransconnectApi.getTypes.mockResolvedValue(mockTypes);
        TransconnectApi.getUser.mockResolvedValue(mockUser);
        TransconnectApi.getUserPosts.mockResolvedValue(mockResources);
        TransconnectApi.deleteResource.mockResolvedValue({});
    });

    it("renders without crashing", () => {
        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("fetches and displays resources", async () => {
        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            const resourceCards = screen.getAllByTestId("resource-card");
            expect(resourceCards.length).toBe(mockResources.length);
            expect(resourceCards[0]).toHaveTextContent(mockResources[0].name);
            expect(resourceCards[1]).toHaveTextContent(mockResources[1].name);
        });
    });

    it("displays message when no resources are found", async () => {
        TransconnectApi.getResources.mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Sorry, no results were found!")).to.exist;
        });
    });

    it("handles resource deletion", async () => {
        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("resource-card")).to.exist;
        });

        fireEvent.click(screen.getByTestId("resource-card"));

        await waitFor(() => {
            expect(TransconnectApi.deleteResource).toHaveBeenCalledWith(101);
            expect(screen.queryByTestId("resource-card")).to.not.exist;
        });
    });

    it("filters resources based on search term", async () => {
        const searchTerm = "Resource One";
        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );


        fireEvent.change(screen.getByLabelText(/Enter search term.../i), { target: { value: searchTerm } });

        fireEvent.click(screen.getByText("Search"));

        await waitFor(() => {
            const resourceCards = screen.getAllByTestId("resource-card");
            expect(resourceCards.length).toBe(1);
            expect(resourceCards[0]).toHaveTextContent(searchTerm);
        });
    });

    it("filters resources based on selected type", async () => {
        render(
            <MemoryRouter initialEntries={["/resources"]}>
                <UserContext.Provider value={{ currUser: mockCurrUser }}>
                    <Routes>
                        <Route path="/resources" element={<ResourceList />} />
                    </Routes>
                </UserContext.Provider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Type1"));

        await waitFor(() => {
            const resourceCards = screen.getAllByTestId("resource-card");
            expect(resourceCards.length).toBe(1);
            expect(resourceCards[0]).toHaveTextContent("Resource One");
        });
    });
});
