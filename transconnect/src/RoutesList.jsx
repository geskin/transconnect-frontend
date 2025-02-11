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

const RoutesList = ({ signup, login, logout, editUser, createPost }) => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/register" element={<SignupForm signup={signup} />} />
            <Route path="/users/:username" element={<Profile />} />
            <Route path="/users/:username/edit" element={<EditUserForm editUser={editUser} />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/posts/new" element={<NewPostForm createPost={createPost} />} />
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resources/:name" element={<ResourceDetail />} />
            <Route path="/logout" element={<Logout logout={logout} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default RoutesList;