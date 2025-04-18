import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link } from "react-router-dom";
import TransconnectApi from "../api";
import ResourceCard from "./ResourceCard";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/** ResourceList: displays list of resources in card form
 * 
 * Admin have additional functionality; regular users can only add resources and see approved ones
 */

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [types, setTypes] = useState([]);
    const [searchType, setSearchType] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { currUser } = useContext(UserContext);

    useEffect(() => {

        const fetchResources = async () => {
            try {
                let data = await TransconnectApi.getResources();
                if (!currUser || currUser?.role === "USER") {
                    data = data.filter((r) => r.approved);
                }
                setResources(data);
            } catch (err) {
                console.error("Error fetching resources", err);
            }
        };

        const fetchTypes = async () => {
            try {
                const data = await TransconnectApi.getTypes();
                let typeList = data.map((t) => t.name);
                setTypes(typeList);
            } catch (err) {
                console.error("Error fetching types", err);
            }
        };

        fetchResources();
        fetchTypes();
    }, [currUser]);

    const handleDeleteResource = async (resourceId) => {
        try {
            await TransconnectApi.deleteResource(resourceId);
            const updatedResources = await TransconnectApi.getResources();
            setResources(updatedResources);
        } catch (err) {
            console.error("Error deleting resource", err);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const selectedType = e.target.value;
        setSearchType(selectedType);

        try {
            const data = await TransconnectApi.getResources("", selectedType);
            setResources(data);
        } catch (err) {
            console.error("Error fetching resources", err);
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await TransconnectApi.getResources(searchTerm, "");
            setResources(data);
        } catch (err) {
            console.error("Error fetching resources", err);
        }
    };

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, p: 2 }}>
                <TextField
                    fullWidth
                    label="Enter search term..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ maxWidth: 600 }}
                />
                <Button type="submit" variant="contained" onClick={handleSubmit}>
                    Search
                </Button>
            </Box>

            <div>
                <Button value="" onClick={handleClick} variant="outlined">
                    X
                </Button>
                {types.map((t) => (
                    <Button key={t} value={t} onClick={handleClick} variant="outlined" sx={{ m: 0.5 }}>
                        {t}
                    </Button>
                ))}
            </div>

            <div>
                {resources.length ? (
                    <div>
                        {resources.map((r) => (
                            <ResourceCard
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                description={r.description}
                                url={r.url}
                                types={r.types}
                                userId={r.userId}
                                approved={r.approved}
                                onDelete={handleDeleteResource}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="lead white-letters">Sorry, no results were found!</p>
                )}
            </div>

            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button variant="contained" component={Link} to="/resources/new">
                    Submit a resource
                </Button>
            </Box>
        </div>
    );
};

export default ResourceList;
