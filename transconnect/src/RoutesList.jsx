import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import Profile from "./users/Profile";
import PostsList from "./posts/PostsList";
import ResourceList from "./resources/ResourceList";
import EditUserForm from "./users/EditUserForm";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import ResourceDetail from "./resources/ResourceDetail";
import Logout from "./auth/Logout";
import NewPostForm from "./posts/NewPostForm";
import NewResourceForm from "./resources/NewResourceForm";
import PostDetail from "./posts/PostDetail";
import EditResourceForm from "./resources/EditResourceForm";
import EditPostForm from "./posts/EditPostForm";
import BathroomList from "./bathrooms/BathroomList";

/** RoutesList: list of all app routes */

const RoutesList = ({ signup, login, logout, editUser, createPost, submitResource, updateResource, editPost }) => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/register" element={<SignupForm signup={signup} />} />
            <Route path="/users/:username" element={<Profile />} />
            <Route path="/users/:username/edit" element={<EditUserForm editUser={editUser} />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/new" element={<NewPostForm createPost={createPost} />} />
            <Route path="/posts/:id/edit" element={<EditPostForm editPost={editPost} />} />
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resources/new" element={<NewResourceForm submitResource={submitResource} />} />
            <Route path="/resources/:id" element={<ResourceDetail />} />
            <Route path="/resources/:id/edit" element={<EditResourceForm updateResource={updateResource} />} />
            <Route path="/bathrooms" element={<BathroomList />} />
            <Route path="/logout" element={<Logout logout={logout} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default RoutesList;