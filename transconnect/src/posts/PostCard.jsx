import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


/** PostCard: inidividual card for a resource. List of these cards is shown in PostsList */

const PostCard = ({
    title,
    id,
    createdAt,
    editedAt,
    content,
    user,
    comments }) => {

    return (
        <Card className="card" >
            <CardContent className="card-body">
                <Link to={`/users/${user.username}`} ><h3>{user.username}</h3></Link>
                <Link to={`/posts/${id}`}>
                    <h3 className="card-title text-start">
                        {title}
                    </h3>
                </Link>
                <p className="text-start"><small>{content}</small></p>
                <i>{formatDate(createdAt)}</i>
            </CardContent>
        </Card>
    );
}

export default PostCard;