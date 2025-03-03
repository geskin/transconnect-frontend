import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import PostCard from "./PostCard";

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    const { currUser } = useContext(UserContext);
    console.debug("Posts", "currUser=", currUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchPosts = async () => {
            try {
                const data = await TransconnectApi.getPosts();
                setPosts(data);
            } catch (err) {
                console.error("Error fetching posts", err);
            }
        };
        const fetchTags = async () => {
            try {
                const data = await TransconnectApi.getTags();
                let tagList = data.map(t => (t.name));
                setTags(tagList);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        }

        fetchPosts();
        fetchTags();
    }, [currUser, navigate]);

    const handleClick = async (e) => {
        e.preventDefault();
        setSearchTag(e.target.value);
        // filter posts by tag(s)
        try {
            const data = await TransconnectApi.getPosts(searchTag); // only works if posts can have 1 tag only
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    }

    return (
        <div>
            <div>
                <button value='' onClick={handleClick}>X</button>
                {tags.map(t => (<button name={t} value={t} onClick={handleClick}>{t}</button>))}
            </div>
            <div>
                {posts.length
                    ? (
                        <div>
                            {posts.map(p => (
                                <PostCard
                                    key={p.id}
                                    id={p.id}
                                    title={p.title}
                                    createdAt={p.createdAt}
                                    editedAt={p.editedAt}
                                    content={p.content}
                                    user={p.user}
                                    comments={p.comments}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="lead white-letters">Sorry, no results were found!</p>
                    )}
            </div>
            <div>
                <button className="btn btn-lg btn-primary"><Link to="/posts/new">Say something</Link></button>
            </div>
        </div>
    );
}

export default PostsList;