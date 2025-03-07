import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TransconnectApi from "../api";
import UserContext from "../UserContext";

/** ResourceDetail: displays details on a specific resource
 * 
 * auth required: none
 * 
 * an unapproved resource and certain functionality is only visible/accessible to admins
 * (e.g. approve resource button)
 */

const ResourceDetail = () => {
    const params = useParams();
    const id = params.id;
    const [resource, setResource] = useState({});
    const { currUser } = useContext(UserContext);
    console.debug("Resource detail", currUser);
    const navigate = useNavigate();

    useEffect(() => {
        console.debug("useEffect triggered with id:", id);

        const fetchResource = async () => {
            try {
                const resource = await TransconnectApi.getResource(id);
                console.debug(resource);
                setResource(resource);
            } catch (err) {
                console.error("Error fetching resource", err);
            }
        }
        fetchResource();
    }, [id]);

    if (!resource.approved && currUser.role !== 'ADMIN') navigate('/resources');

    return (
        <div className="col-md-8 offset-md-2">
            {currUser.role === 'ADMIN' ?
                <div>
                    {resource.approved ? <i>Approved</i> : <i>Pending approval</i>}
                    <h3 className="mb-3 white-letters"><Link to={resource.url}>{resource.name}</Link></h3>
                    <p className="white-letters">{resource.description}</p>
                    <div>
                        {resource.types.map(t => (<i>{t.name}</i>))}
                    </div>
                    <div>
                        <button><Link to={`/resources/${resource.id}/edit`}>Edit</Link></button>
                        <Link to="/resources">Back to resources</Link>
                    </div>
                </div>
                :
                <div>
                    <h3 className="mb-3 white-letters"><Link to={resource.url}>{resource.name}</Link></h3>
                    <p className="white-letters">{resource.description}</p>
                    <div>
                        {resource.types.map(t => (<i>{t.name}</i>))}
                    </div>
                    <div>
                        <Link to="/resources">Back to resources</Link>
                    </div>
                </div>
            }
        </div>
    );
}

export default ResourceDetail;