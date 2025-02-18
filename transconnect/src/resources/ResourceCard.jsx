import React from "react";
import { Link } from "react-router-dom";

const ResourceCard = ({ id, name, description, url }) => {
    return (
        <Link className="card" to={`/resources/${id}`}>
            <div className="card-body">
                <h6 className="card-title text-start">
                    <Link to={url}>
                        {name}
                    </Link>
                </h6>
                <p className="text-start"><small>{description}</small></p>
            </div>
        </Link>
    );
}

export default ResourceCard;