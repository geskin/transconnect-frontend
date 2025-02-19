import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/ResourceCard.css";
import UserContext from "../UserContext";

const ResourceCard = ({ id, name, description, url, approved }) => {
    const { currUser } = useContext(UserContext);
    const [approval, setApproval] = useState(approved);

    useEffect(() => { //re-render card if approval state changes

    }, [approval]);

    const approveResource = () => {
        if (approval) { //if already approved
            setApproval(false); // how to set approval state of resource globally -> need to only show approved ones to regular user in ResourceList
        } else {
            setApproval(true);
        }
    }

    return (
        <div className="ResourceCard card">
            <div className="card-body">
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

                {currUser.role === 'ADMIN' ?
                    <div>
                        {approved ?
                            <button onClick={approveResource}>Approved</button>
                            :
                            <button onClick={approveResource}>Approve</button>
                        }
                        <Link to={`/resources/${id}/edit`}>Edit</Link>
                        <Link to={`/resources/${id}`}>Details</Link>
                    </div>
                    :
                    <div>
                        <Link to={`/resources/${id}`}>Details</Link>
                    </div>
                }
            </div>
        </div>
    );
}

export default ResourceCard;