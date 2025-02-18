import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import UserContext from "../UserContext";

const NewPostForm = ({ createPost }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tag: "" // tags: []
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
                let tagList = data.map(t => (t.name));
                setTags(tagList);
            } catch (err) {
                console.error("Error fetching tags", err);
            }
        }
        fetchTags();
    }, [currUser, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = e => {
        e.preventDefault();
        createPost({ ...formData });
        setFormData({
            title: "",
            content: "",
            tag: "" //tags: []
        });
        navigate("/posts");
    };

    //where tags are a checkbox input (change from radio) where you can select up to 3 tags

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
                                <label className="form-label"><b>Choose a tag:</b></label>
                                {tags.map(t => (
                                    <div key={t.name} className="form-check">
                                        <input
                                            onChange={handleChange}
                                            type="radio"
                                            name="tag"
                                            value={t.name}
                                            id={t.name}
                                            checked={formData.tag === t.name} // Makes it a controlled component (form data is handled by the component not DOM)
                                            className="form-check-input"
                                        />
                                        <label className="form-check-label" htmlFor={t.name}>{t.name}</label>
                                    </div>
                                ))}
                                {formData.tag && (
                                    <button type="button" onClick={() => setFormData(fData => ({ ...fData, tag: "" }))}
                                        className="btn btn-outline-danger btn-sm mt-2">
                                        X Clear Selection
                                    </button>
                                )}
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