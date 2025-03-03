import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { useNavigate, useParams } from "react-router-dom";
import TransconnectApi from "../api";
import { formatDate } from "../utils/formatDate";

/** PostDetail: shows details on a particular post including all associated comments 
 * 
 * auth required: logged in
*/

const PostDetail = () => {
    const { id } = useParams();
    console.debug(id);
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
            <i>Posted on: {formatDate(post.createdAt)}</i>
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