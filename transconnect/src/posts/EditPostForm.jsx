import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

const EditPostForm = ({ updatePost }) => {
    const params = useParams();
    const id = params.id;
    console.debug("id:", id);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [post, setPost] = useState({});
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: []
    });


    //how to do this so that if it isn't admin or currUser's post to navigate away?
    useEffect(() => {
        if (currUser.role !== 'ADMIN' || !currUser) navigate('/posts');

        const fetchPost = async () => {
            try {
                const post = await TransconnectApi.getPost(id);
                console.debug(post); //does this include userId?
                setPost(post);
                setFormData({
                    title: post.title,
                    content: post.content,
                    tags: post.tags
                });
            } catch (err) {
                console.error("Error fetching post", err);
            }
        }
        const fetchTags = async () => {
            try {
                const data = await TransconnectApi.getTags();
                let tagList = data.map(t => (t.name));
                setTags(tagList);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        }
        fetchPost();
        fetchTags();
    }, [id, currUser]);

    useEffect(() => {
        if (currUser.id !== post.userId || currUser.role !== 'ADMIN') navigate('/posts');
    }, [currUser]);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleCheckbox = e => {
        if (formData.tags.includes(e.target.value)) {
            //remove e.target.value from array
            const filteredTags = formData.tags.filter(t => (t !== e.target.value)); //include everything in the types array except for e.target.value
            setFormData(formData => ({
                ...formData,
                tags: filteredTags
            }));
        } else {
            setFormData(formData => ({
                ...formData,
                tags: [...formData.tags, e.target.value]
            }));
        }
    }

    const gatherInput = async (e) => {
        e.preventDefault();
        try {
            await updateResource(
                formData.title,
                formData.content,
                formData.tags);

            // Update the current user data in the form
            setFormData({
                title: formData.title,
                content: formData.content,
                tags: formData.tags
            });

            navigate(`/posts/${id}`);
        } catch (err) {
            console.error("Error updating post:", err);
        }
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Edit Post</h2>
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={gatherInput}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="title"><b>Title</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    id="title"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="content"><b>Content</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="content"
                                    value={formData.content}
                                    id="content"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Tags:</b></label>
                                {tags.map((t) => (
                                    <div key={t} className="form-check">
                                        <input
                                            onChange={handleCheckbox}
                                            type="checkbox"
                                            name={t}
                                            value={t}
                                            id={t}
                                            checked={formData.tags.includes(t)}
                                            className="form-check-input"
                                        />
                                        <label className="form-check-label" htmlFor={t}>{t}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Update post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default EditPostForm;