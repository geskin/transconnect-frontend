import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Card.css";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { formatDate } from "../utils/formatDate";

/** PostCard: Individual card for a post. Displayed in PostList. */

const PostCard = ({ title, id, createdAt, content, user, tags, onDelete }) => {
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    const deletePost = async () => {
        try {
            let post = await TransconnectApi.getPost(id);
            await TransconnectApi.deletePost(id, post);
            onDelete(id);
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    return (
        <Card className="Card card" sx={{ minHeight: 400, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardContent className="card-body">
                <h3><Link to={`/users/${user.username}`}>@{user.username}</Link></h3>
                <h2 className="card-title text-start">
                    <Link to={`/posts/${id}`}><b>{title}</b></Link>
                </h2>
                <p className="text-start">{content}</p>
                {tags && tags.length > 0 && (
                    <div>
                        {tags.map(t => (
                            <Button variant="outlined" disabled key={t.name}>
                                {t.name}
                            </Button>
                        ))}
                    </div>
                )}
                <small><i>Posted {formatDate(createdAt)}</i></small>
            </CardContent>
            <CardActions sx={{ padding: "16px", display: "flex", justifyContent: "flex-start" }}>
                {currUser.role === "ADMIN" || currUser.username === user.username ? (
                    <div>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ ml: 2 }}
                            onClick={deletePost}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => navigate(`/posts/${id}/edit`)} size="small">Edit</Button>
                        <Button onClick={() => navigate(`/posts/${id}`)} size="small">View Comments</Button>
                    </div>
                ) : (
                    <Button onClick={() => navigate(`/posts/${id}`)} size="small">View Comments</Button>
                )}
            </CardActions>
        </Card>
    );
};

export default PostCard;
