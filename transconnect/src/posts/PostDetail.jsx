import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { useNavigate, useParams } from "react-router-dom";
import TransconnectApi from "../api";

/** PostDetail: shows details on a particular post including all associated comments */

const PostDetail = () => {
    const params = useParams();
    console.debug(params); // is it params.id or params.post_id?
    const id = params.id;
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState({});
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) navigate('/');

        const fetchPost = async () => {
            try {
                const post = await TransconnectApi.getPost(id);
                if (post) {
                    setPost(post);
                    setComments(post.comments);
                }
            } catch (err) {
                console.error("Error fetching post", err);
            }
        }
        fetchPost();
    }, [currUser, id]);

    return (
        <div className="col-md-8 offset-md-2">
            <h3 className="mb-3 white-letters">{post.title}</h3>
            <p className="white-letters">{post.content}</p>
            <div>
                {comments ?
                    <ul>
                        {comments.map(c => (<li>{c.content}</li>))}
                    </ul>
                    :
                    <p>No comments yet!</p>
                }
            </div>
        </div>
    );
}

export default PostDetail;