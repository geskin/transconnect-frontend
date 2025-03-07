import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Card.css";
import UserContext from "../UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { formatDate } from "../utils/formatDate";
import TransconnectApi from "../api";

/** PostCard: Individual card for a post. Displayed in PostList. */

const PostCard = ({ title, id, createdAt, editedAt, content, user, comments, tags }) => {
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    const deletePost = async () => {
        try {
            let post = await TransconnectApi.getPost(id);
            await TransconnectApi.deletePost(id, post);
            navigate("/posts");
        } catch (err) {
            console.error("Error deleting resource:", err);
        }
    }

    return (
        <Card className="Card card">
            <CardContent className="card-body">
                <Link to={`/users/${user.username}`}>
                    <h3>@{user.username}</h3>
                </Link>
                <Link to={`/posts/${id}`}>
                    <h3 className="card-title text-start">{title}</h3>
                </Link>
                <p className="text-start"><small>{content}</small></p>
                <i>{formatDate(createdAt)}</i>

                {tags && tags.length > 0 && (
                    <div>
                        {tags.map(t => (
                            <Button variant="outlined" disabled key={t.name}>
                                {t.name}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardActions>
                {currUser.role === "ADMIN" || currUser.username === user.username ? (
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            component={Link}
                            to={`/posts/${id}/edit`}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ mt: 2, ml: 2 }}
                            onClick={deletePost}
                        >
                            Delete
                        </Button>
                        <Button onClick={() => navigate(`/posts/${id}`)} size="small">Details</Button>
                    </div>
                ) : (
                    <Button onClick={() => navigate(`/posts/${id}`)} size="small">Details</Button>
                )}
            </CardActions>
        </Card>
    );
};

export default PostCard;
