import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import TransconnectApi from "../api";

const NewResourceForm = ({ submitResource }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        url: "",
        type: []
    });
    const [types, setTypes] = useState([]);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchTypes = async () => {
            try {
                const data = await TransconnectApi.getTypes();
                let typeList = data.map(t => (t.name));
                setTypes(typeList);
            } catch (err) {
                console.error("Error fetching resource types", err);
            }
        }
        fetchTypes();
    }, [currUser]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const gatherInput = e => {
        e.preventDefault();
        submitResource({ ...formData });
        setFormData({
            name: "",
            description: "",
            url: "",
            type: []
        });
        navigate("/resources");
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
                                <label className="form-label" htmlFor="name"><b>Resource Name</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    id="name"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="description"><b>Description</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    id="description"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Type of resource:</b></label>
                                {types.map(t => (
                                    <div key={t.name} className="form-check">
                                        <input
                                            onChange={handleChange}
                                            type="checkbox"
                                            name="tags"
                                            value={t.name}
                                            id={t.name}
                                            checked={formData.type === t.name} //this needs to be changed so it can take an array instead of string
                                            className="form-check-input"
                                        />
                                        <label className="form-check-label" htmlFor={t.name}>{t.name}</label>
                                    </div>
                                ))}
                                {formData.tags && (
                                    <button type="button" onClick={() => setFormData(fData => ({ ...fData, tags: [] }))}
                                        className="btn btn-outline-danger btn-sm mt-2">
                                        Clear Selection
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

export default NewResourceForm;