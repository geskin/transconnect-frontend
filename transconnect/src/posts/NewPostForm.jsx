import React from "react";
import { useNavigate } from "react-router-dom";

const NewPostForm = ({ createPost }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: []
    });
    const navigate = useNavigate();

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
            tags: []
        });
        navigate("/posts");
    };

    //where tags are a checkbox input where you can select up to 3 tags

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Sign Up</h2>
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