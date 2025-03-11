import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../css/Card.css";
import { Card, CardContent, CardActions, Button } from "@mui/material";
import TransconnectApi from "../api";
import UserContext from "../UserContext";

/** ResourceDetail: displays details of a specific resource
 * 
 * - Auth required: none
 * - Certain functionality (e.g., approval) is only visible to admins
 */

const ResourceDetail = () => {
    const { id } = useParams();
    const [resource, setResource] = useState({ types: [] });
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const fetchedResource = await TransconnectApi.getResource(id);
                console.debug("Fetched resource", fetchedResource);
                setResource(fetchedResource);
            } catch (err) {
                console.error("Error fetching resource", err);
            }
        };
        fetchResource();
    }, [id]);

    if (!resource.approved && currUser.role !== "ADMIN") navigate("/resources");

    const toggleApproval = async () => {
        try {
            const newApprovalState = !resource.approved;
            await TransconnectApi.approve(newApprovalState, id);
            setResource(prev => ({ ...prev, approved: newApprovalState }));
        } catch (err) {
            console.error("Error toggling approval", err);
        }
    };

    const deleteResource = async () => {
        try {
            await TransconnectApi.deleteResource(id);
            navigate("/resources");
        } catch (err) {
            console.error("Error deleting resource:", err);
        }
    };

    return (
        <Card className="Card card" sx={{ minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardContent className="card-body">
                {/* Admin-only approval status */}
                {currUser.role === "ADMIN" && (
                    <p className="text-start" style={{ color: resource.approved ? "green" : "red", fontWeight: "bold" }}>
                        {resource.approved ? "Approved" : "Pending Approval"}
                    </p>
                )}

                {/* Resource Name */}
                <h2 className="card-title text-start">
                    {resource.url ? <Link to={resource.url}><b>{resource.name}</b></Link> : <b>{resource.name}</b>}
                </h2>

                {/* Description */}
                <p className="text-start"><i>{resource.description}</i></p>

                {/* Resource Types */}
                <div>
                    {resource.types.map(t => (
                        <Button variant="outlined" disabled key={t.name}>
                            {t.name}
                        </Button>
                    ))}
                </div>
            </CardContent>

            {/* Buttons */}
            <CardActions sx={{ padding: "16px", display: "flex", justifyContent: "flex-start" }}>
                <Button onClick={() => navigate("/resources")} size="small">Back to Resources</Button>

                {currUser.role === "ADMIN" && (
                    <>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } }}
                            onClick={toggleApproval}
                        >
                            {resource.approved ? "Approved" : "Approve"}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ ml: 2 }}
                            onClick={deleteResource}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => navigate(`/resources/${id}/edit`)} size="small">Edit</Button>
                    </>
                )}
            </CardActions>
        </Card>
    );
};

export default ResourceDetail;
