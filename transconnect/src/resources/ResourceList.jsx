import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import TransconnectApi from "../api";
import ResourceCard from "./ResourceCard";

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [types, setTypes] = useState([]);
    const [searchType, setSearchType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { currUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currUser) {
            navigate("/");
        }
        const fetchResources = async () => {
            try {
                let data = await TransconnectApi.getResources();
                if (currUser.role === 'USER') {
                    data = data.filter(r => r.approved); // Only approved resources for non-admin users
                }
                setResources(data);
            } catch (err) {
                console.error("Error fetching resources", err);
            }
        };
        const fetchTypes = async () => {
            try {
                const data = await TransconnectApi.getTypes();
                let typeList = data.map(t => (t.name));
                setTypes(typeList);
            } catch (err) {
                console.error("Error fetching types", err);
            }
        }

        fetchResources();
        fetchTypes();
    }, [currUser]);

    const handleClick = async (e) => {
        e.preventDefault();
        setSearchType(e.target.value);
        // filter posts by type (can only search by one type at a time?)
        try {
            const data = await TransconnectApi.getResources(searchType);
            setResources(data);
        } catch (err) {
            console.error("Error fetching resources", err);
        }
    }

    // Handle search bar input change
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await TransconnectApi.getResources(searchTerm);
            setResources(data);
        } catch (err) {
            console.error("Error fetching resources", err);
        }
    };

    console.debug(resources);

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="row justify-content-center gx-0">
                        <div className="col-8">
                            <input
                                onChange={handleChange}
                                className="form-control form-control-lg"
                                name="searchTerm"
                                placeholder="Enter search term.."
                            />
                        </div>
                        <div className="col-auto">
                            <button
                                type="submit"
                                className="btn btn-lg btn-primary">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <button value='' onClick={handleClick}>X</button>
                {types.map(t => (<button key={t} name={t} value={t} onClick={handleClick}>{t}</button>))}
            </div>
            <div>
                {resources.length
                    ? (
                        <div>
                            {resources.map(r => (
                                <ResourceCard
                                    key={r.id}
                                    id={r.id}
                                    name={r.name}
                                    description={r.description}
                                    url={r.url}
                                    types={r.types}
                                    userId={r.userId}
                                    approved={r.approved}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="lead white-letters">Sorry, no results were found!</p>
                    )}
            </div>
            <div>
                <button className="btn btn-lg btn-primary"><Link to="/resources/new">Submit a resource</Link></button>
            </div>
        </div>
    );
}

export default ResourceList;