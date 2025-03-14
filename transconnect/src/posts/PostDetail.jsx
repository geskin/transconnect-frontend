import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import TransconnectApi from "../api";
import { formatDate } from "../utils/formatDate";
import CommentsBottomNavigation from "../utils/bottomNav";
import "../css/PostDetail.css";
import { Button, Typography } from "@mui/material";


/** PostDetail: shows details on a particular post including all associated comments 
 * 
 * auth required: logged in
*/

const PostDetail = () => {
    const { id } = useParams();
    console.debug(id);
    const [post, setPost] = useState({ tags: [] });
    const [user, setUser] = useState({});
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    if (!currUser) return <Typography>Loading...</Typography>;

    useEffect(() => {
        console.debug(currUser);

        if (!currUser) {
            navigate("/posts");
            return;
        }

        const fetchPost = async () => {
            try {
                const post = await TransconnectApi.getPost(id);
                console.debug(post);
                if (post) {
                    setPost(post);
                    setUser(post.user);
                }
            } catch (err) {
                console.error("Error fetching post", err);
            }
        };

        fetchPost();
    }, [currUser, id, navigate]);

    const handleDeletePost = async () => {
        try {
            await TransconnectApi.deletePost(id);
            navigate("/posts");
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    return (
        <div className="col-md-8 offset-md-2">
            <div className="post-details">
                <h4><Link to={`/users/${user.username}`}>@{user.username}</Link></h4>
                <h3 className="mb-3">{post.title}</h3>
                <p>{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                    <div>
                        {post.tags.map(t => (
                            <Button variant="outlined" disabled key={t.name}>
                                {t.name}
                            </Button>
                        ))}
                    </div>
                )}
                <small><i>Posted {formatDate(post.createdAt)}</i></small>
                {(currUser.role === "ADMIN" || currUser.username === user.username) && (
                    <div>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeletePost}
                            size="small"
                        >
                            Delete
                        </Button>
                        <Button onClick={() => navigate(`/posts/${id}/edit`)} size="small">
                            Edit
                        </Button>
                    </div>
                )}

            </div>
            <hr></hr>
            <div>
                <CommentsBottomNavigation postId={id} />
            </div>
        </div>
    );
}

export default PostDetail;
