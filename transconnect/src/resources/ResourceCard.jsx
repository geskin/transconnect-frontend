import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/ResourceCard.css";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/** ResourceCard: the card displayed in ResourceList for each individual resource */

const ResourceCard = ({ id, name, description, url, types, userId, approved }) => {
    const { currUser } = useContext(UserContext);
    const [approval, setApproval] = useState(approved);
    console.debug(types);

    useEffect(() => { //re-render card if approval state changes
        if (approval) {
            setApproval(true);
        } else {
            setApproval(false);
        }
    }, [approval]);

    const approveResource = async (e) => {
        e.preventDefault();
        if (!approval) {
            try {
                const data = await TransconnectApi.approve(approval, id);
                console.log(`Resource successfully approved.`);
                setApproval(true);
            } catch (err) {
                console.error("Error approving resource", err);
            }
        } else {
            try {
                const data = await TransconnectApi.approve(approval, id);
                console.log(`Resource pending approval.`);
                setApproval(false);
            } catch (err) {
                console.error("Error recinding approval", err);
            }
        }
    }

    return (
        <Card className="ResourceCard card">
            <CardContent className="card-body">
                <h2 className="card-title text-start">
                    {url ?
                        <Link to={url}>
                            <b>{name}</b>
                        </Link>
                        :
                        <b>{name}</b>
                    }
                </h2>
                <p className="text-start"><i>{description}</i></p>
                <ul>
                    {types.map(t => <li>{t.name}</li>)}
                </ul>

                {currUser.role === 'ADMIN' ?
                    <div>
                        {approved ?
                            <button className="btn btn-danger fw-bold text-uppercase float-end" onClick={approveResource}>Approved</button>
                            :
                            <button className="btn btn-danger fw-bold text-uppercase float-end" onClick={approveResource}>Approve</button>
                        }
                        <Link to={`/resources/${id}/edit`}>Edit</Link>
                        <Link to={`/resources/${id}`}>Details</Link>
                    </div>
                    :
                    <div>
                        <Link to={`/resources/${id}`}>Details</Link>
                    </div>
                }
            </CardContent>
        </Card>
    );
}

export default ResourceCard;