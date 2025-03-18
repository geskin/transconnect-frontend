import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";
import PostCard from "./PostCard";

/** UserPostsList: list of posts (in card format) made by a specific user
 * 
 * auth required: logged in user
 */

const UserPostsList = () => {
    const { username } = useParams();
    const { currUser } = useContext(UserContext);
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!currUser) return;

        const fetchUser = async () => {
            try {
                let user = await TransconnectApi.getUser(username);
                setUser(user)
            } catch (err) {
                console.error(`Error fetching user: ${username}`, err);
            }
        }

        const fetchUserPosts = async () => {
            try {
                let userPosts = await TransconnectApi.getUserPosts(user.id);
                setPosts(userPosts);
            } catch (err) {
                console.error(`Error fetching ${username}'s posts`, err);
            }
        }

        fetchUser();
        fetchUserPosts();
    });

    const handleDeletePost = async (postId) => {
        try {
            await TransconnectApi.deletePost(postId);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            console.error("Error deleting post", err);
        }
    };

    return (
        <div>
            <div>
                {posts.length > 0 ? (
                    posts.map((p) => (
                        <PostCard
                            key={p.id}
                            id={p.id}
                            title={p.title}
                            createdAt={p.createdAt}
                            editedAt={p.editedAt}
                            content={p.content}
                            user={p.user}
                            comments={p.comments}
                            tags={p.tags}
                            onDelete={handleDeletePost}
                        />
                    ))
                ) : (
                    <p className="lead white-letters">Sorry, no results were found!</p>
                )}
            </div>
        </div>
    );

}

export default UserPostsList;