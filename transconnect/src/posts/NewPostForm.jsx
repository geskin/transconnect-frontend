import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import UserContext from "../UserContext";

/** NewPostForm: form for submitting new post
 * 
 * auth required: logged in
 */

const NewPostForm = ({ createPost }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: []
    });
    const [tags, setTags] = useState([]);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchTags = async () => {
            try {
                const data = await TransconnectApi.getTags();
                console.debug(data);
                let tagList = data.map(t => (t.name));
                setTags(tagList);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        }
        fetchTags();
    }, [currUser]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleCheckbox = e => {
        if (formData.tags.includes(e.target.value)) {
            //remove e.target.value from array
            const filteredTags = formData.tags.filter(t => (t !== e.target.value));
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

    const gatherInput = e => {
        e.preventDefault();
        createPost({ ...formData, userId: currUser.id });
        setFormData({
            title: "",
            content: "",
            tags: []
        });
        navigate("/posts");
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">New Post</h2>
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
                                    Post!
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewPostForm;