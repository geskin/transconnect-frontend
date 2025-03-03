import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import TransconnectApi from "../api";
import { formatDate } from "../utils/formatDate";
import "../css/Profile.css";

/** Profile: displays non-sensitive user information (unless username same as currUser.username or user is admin) 
 * 
 * auth required: logged in
 * 
 * can get to profile page by typing users/[username] or clicking on the username listed on a post or comment
 * 
 * routes -> profile
*/

const Profile = () => {
    const { username } = useParams();
    const { currUser } = useContext(UserContext);
    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    if (!currUser) return <p>Loading...</p>;

    useEffect(() => {
        console.debug("running Profile useEffect", "currUser=", currUser);

        if (!currUser) navigate('/');

        if (username !== currUser.username) {
            const fetchUser = async () => {
                try {
                    const user = await TransconnectApi.getUser(username);
                    setUser(user);
                } catch (err) {
                    console.error("Error fetching user info", err);
                }
            };
            fetchUser();
        }
    }, [username, currUser]);

    return (
        <div>
            {
                (username === currUser.username) ?
                    <div>
                        <h2 className="mb-4 fw-bold">{username}</h2>
                        <p>{currUser.pronouns}</p>
                        <p>{currUser.bio}</p>
                        <p>{currUser.email}</p>
                        <i>Created on: {formatDate(currUser.createdAt)}</i>
                        <button>
                            <Link to={`/users/${username}/edit`} className="btn btn-primary fw-bold me-3">Edit Profile</Link>
                        </button>
                    </div>
                    :
                    <div>
                        <h2 className="mb-4 fw-bold">{user.username}</h2>
                        <p>{user.bio}</p>
                        <i>Created on: {formatDate(user.createdAt)}</i>
                    </div>
            }
        </div>
    );
}

export default Profile;