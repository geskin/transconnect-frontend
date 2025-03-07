import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Card.css";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

/** ResourceCard: the card displayed in ResourceList for each individual resource */

const ResourceCard = ({ id, name, description, url, types, userId, approved }) => {
    const { currUser } = useContext(UserContext);
    const [approval, setApproval] = useState(approved);
    const navigate = useNavigate();

    const toggleApproval = async (e) => {
        e.preventDefault();
        try {
            const newApprovalState = !approval;
            await TransconnectApi.approve(newApprovalState, id);
            setApproval(newApprovalState);
        } catch (err) {
            console.error("Error toggling approval", err);
        }
    };

    const deleteResource = async () => {
        try {
            let resource = await TransconnectApi.getResource(id);
            await TransconnectApi.deleteResource(id, resource);
            navigate("/resources");
        } catch (err) {
            console.error("Error deleting resource:", err);
        }
    }

    return (
        <Card className="Card card">
            <CardContent className="card-body">
                <h2 className="card-title text-start">
                    {url ? <Link to={url}><b>{name}</b></Link> : <b>{name}</b>}
                </h2>
                <p className="text-start"><i>{description}</i></p>
                <div>
                    {types.map(t => (
                        <Button variant="outlined" disabled key={t.name}>
                            {t.name}
                        </Button>
                    ))}
                </div>
            </CardContent>
            <CardActions>
                {currUser.role === 'ADMIN' ? (
                    <div>
                        <button
                            className="btn btn-danger fw-bold text-uppercase float-end"
                            onClick={toggleApproval}
                        >
                            {approval ? "Approved" : "Approve"}
                        </button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mt: 2, ml: 2 }}
                            onClick={deleteResource}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => navigate(`/resources/${id}/edit`)} size="small">Edit</Button>
                        <Button onClick={() => navigate(`/resources/${id}`)} size="small">Details</Button>
                    </div>
                ) : (
                    <div>
                        <Button onClick={() => navigate(`/resources/${id}`)} size="small">Details</Button>
                    </div>
                )}
            </CardActions>
        </Card>
    );
};

export default ResourceCard;