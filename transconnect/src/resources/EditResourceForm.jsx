import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import TransconnectApi from "../api";

/** EditResourceForm: form for editing a resource
 * 
 * auth required: admin
 */

const EditResourceForm = ({ updateResource }) => {
    const params = useParams();
    const id = params.id;
    console.debug("id:", id);
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        url: "",
        types: []
    });

    useEffect(() => {
        if (currUser.role !== 'ADMIN' || !currUser) navigate('/resources');

        const fetchResource = async () => {
            try {
                const resource = await TransconnectApi.getResource(id);
                console.debug(resource); //resource.types doesn't exist?
                setFormData({
                    name: resource.name,
                    description: resource.description,
                    url: resource.url,
                    types: resource.types
                });
            } catch (err) {
                console.error("Error fetching resource", err);
            }
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
        fetchResource();
        fetchTypes();
    }, [id]);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    };

    const handleCheckbox = e => {
        if (formData.types.includes(e.target.value)) {
            //remove e.target.value from array
            const filteredTypes = formData.types.filter(t => (t !== e.target.value)); //include everything in the types array except for e.target.value
            setFormData(formData => ({
                ...formData,
                types: filteredTypes
            }));
        } else {
            setFormData(formData => ({
                ...formData,
                types: [...formData.types, e.target.value]
            }));
        }
    }

    const gatherInput = async (e) => {
        e.preventDefault();
        try {
            console.debug(formData);
            await updateResource(id, formData);
            // formData.name,
            // formData.description,
            // formData.url,
            // formData.types);

            // Update the current user data in the form
            setFormData({
                name: formData.name,
                description: formData.description,
                url: formData.url,
                types: formData.types
            });

            navigate(`/resources/${id}`); //not working -- unable to go back to resource detail
        } catch (err) {
            console.error("Error updating resource:", err);
        }
    };

    return (
        <div className="Form">
            <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <h2 className="mb-3">Edit Resource</h2>
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
                                <label className="form-label" htmlFor="url"><b>{`URL (if applicable)`}</b></label>
                                <input
                                    onChange={handleChange}
                                    type="text"
                                    name="url"
                                    value={formData.url}
                                    id="url"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label"><b>Resource type:</b></label>
                                {types.map((t) => (
                                    <div key={t} className="form-check">
                                        <input
                                            onChange={handleCheckbox}
                                            type="checkbox"
                                            name={t}
                                            value={t}
                                            id={t}
                                            checked={formData.types.includes(t)}
                                            className="form-check-input"
                                        />
                                        <label className="form-check-label" htmlFor={t}>{t}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                    Update resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default EditResourceForm;