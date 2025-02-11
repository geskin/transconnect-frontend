import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { Link, useParams } from "react-router-dom";
import TransconnectApi from "../api";

/** Profile: displays non-sensitive user information (unless username same as currUser username or admin) 
 * 
 * can get to profile page by typing users/[username] or clicking on the username listed on a post or comment
*/

const Profile = () => {
    const { username } = useParams();
    const { currUser } = useContext(UserContext);
    console.debug("Profile", "currUser=", currUser);

    const [user, setUser] = useState(null)

    useEffect(() => {
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
    }, [username]);

    return (
        <div>
            {
                (username === currUser.username) ?
                    <div>
                        <h2 className="mb-4 fw-bold">{username}</h2>
                        <p>{currUser.pronouns}</p>
                        <p>{currUser.bio}</p>
                        <p>{currUser.email}</p>
                        <i>Created on: {currUser.createdAt}</i>
                        <button>
                            <Link to={`/users/${username}/edit`} className="btn btn-primary fw-bold me-3">Edit Profile</Link>
                        </button>
                    </div>
                    :
                    <div>
                        <h2 className="mb-4 fw-bold">{user.username}</h2>
                        <p>{user.bio}</p>
                        <i>Created on: {user.createdAt}</i>
                    </div>

            }
        </div>

    )


    // if curr user, show edit button and email, else don't
}

export default Profile;