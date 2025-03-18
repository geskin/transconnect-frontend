import axios from "axios";
import process from "process";

const BASE_URL = process.env.VITE_BASE_URL || "https://transconnect-backend.onrender.com";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class TransconnectApi {
    // the token for interactive with the API will be stored here.
    static token = null;

    static async request(endpoint, data = {}, method = "get") {
        // console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = TransconnectApi.token ? { Authorization: `Bearer ${TransconnectApi.token}` } : {};
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static setToken(newToken) {
        TransconnectApi.token = newToken;
    }

    /** Individual API routes */

    //RESOURCES routes

    /** Get all resources
     * optionally filter by type
     */

    static async getResources(searchTerm = "", type = "") {
        try {
            const queryParams = {};
            if (searchTerm) queryParams.searchTerm = searchTerm;
            if (type) queryParams.type = type;

            let res = await this.request("resources", queryParams);
            return res.resources;
        } catch (err) {
            console.error("Error fetching resources", err);
        }
    }


    /** Get a single resource by id */

    static async getResource(id) {
        try {
            let res = await this.request(`resources/${id}`);
            return res.resource;
        } catch (err) {
            console.error(`error fetching resource: id #${id}`, err);
        }
    }

    /** Post a resource (for review) */

    static async submitResource(resource) {
        try {
            let res = await this.request('resources', resource, 'post');
            return res.resource;
        } catch (err) {
            console.error("error submitting resource", err);
        }
    }

    static async patchResource(resourceId, resource) {
        try {
            let res = await this.request(`resources/${resourceId}`, resource, 'patch');
            return res.resource;
        } catch (err) {
            console.error("error submitting resource", err);
        }
    }

    /** Approve (or recind approval of) a resource */

    static async approve(approved, id) {
        try {
            let res = await this.request(`resources/${id}`, { approved }, 'patch');
            return res.resource;
        } catch (err) {
            console.error("error changing approval status", err);
        }
    }

    static async deleteResource(id, resource) {
        try {
            let res = await this.request(`resources/${id}`, resource, 'delete');
            return res.deleted;
        } catch (err) {
            console.error("error deleting resource", err);
        }
    }

    //POSTS routes

    /** Get all posts
     * optionally filter by tag
     */

    static async getPosts(searchTerm = "", tag = "") {
        try {
            const queryParams = {};
            if (searchTerm) queryParams.searchTerm = searchTerm;
            if (tag) queryParams.tag = tag;

            let res = await this.request('posts', queryParams);
            return res.posts;
        } catch (err) {
            console.error("Error fetching posts", err);
        }
    }

    /** Get all posts by a specific user */

    static async getUserPosts(userId) {
        try {
            let res = await this.request(`posts/users/${userId}`);
            return res.posts;
        } catch (err) {
            console.error(`error fetching ${username}'s posts`, err);
        }
    }

    /** Get a single post by id */

    static async getPost(id) {
        try {
            let res = await this.request(`posts/${id}`);
            return res.post;
        } catch (err) {
            console.error(`error fetching post #${id}`, err);
        }
    }

    /** Make a post */

    static async createPost(post) {
        try {
            let res = await this.request('posts', post, 'post');
            return res.post;
        } catch (err) {
            console.error("error creating post", err);
        }
    }

    /** Edit a post */

    static async editPost(postId, post, username) {
        try {
            let res = await this.request(`posts/${postId}`, { post, username }, 'patch');
            return res.post;
        } catch (err) {
            console.error("error editing post", err);
        }
    }

    static async deletePost(id, post) {
        try {
            let res = await this.request(`posts/${id}`, post, 'delete');
            return res.deleted;
        } catch (err) {
            console.error("error deleting resource", err);
        }
    }

    // COMMENTS routes

    /** Get the comments on a post */

    static async getComments(postId) {
        try {
            let res = await this.request(`posts/${postId}/comments`);
            return res.comments;
        } catch (err) {
            console.error("error fetching comments", err);
        }
    }

    /** Get a comment */

    static async getComment(postId, commentId) {
        try {
            let res = await this.request(`posts/${postId}/comments/${commentId}`);
            return res.comment;
        } catch (err) {
            console.error(`error fetching comment with id: ${commentId}`, err);
        }
    }

    /** Make a comment */

    static async createComment(postId, content, authorId) {
        try {
            let res = await this.request(`posts/${postId}/comments`, { content, authorId }, 'post');
            return res.comment;
        } catch (err) {
            console.error("error creating comment", err);
        }
    }

    /** Edit (patch) a comment */

    static async editComment(postId, commentId, comment, username) {
        try {
            let res = await this.request(`posts/${postId}/comments/${commentId}`, { comment, username }, "patch");
            return res.updatedComment;
        } catch (err) {
            console.error("error editing comment", err);
        }
    }

    /** Delete a comment */

    static async deleteComment(postId, commentId, comment, username) {
        try {
            let res = await this.request(`posts/${postId}/comments/${commentId}`, { comment, username }, 'delete');
            return res.deleted;
        } catch (err) {
            console.error("error deleting comment", err);
        }
    }

    // TAGS and TYPES

    static async getTags() {
        try {
            let res = await this.request('posts/tags');
            return res.tags;
        } catch (err) {
            console.error("error fetching tags", err);
        }
    }

    static async getTypes() {
        try {
            let res = await this.request('resources/types');
            return res.types;
        } catch (err) {
            console.error("error fetching resource types", err);
        }
    }

    //AUTH and USER

    /** Get user by username. */

    static async getUser(username) {
        try {
            let res = await this.request(`users/${username}`);
            return res.user;
        } catch (err) {
            console.error(`error fetching user ${username}`, err);
        }
    }

    /** Authenticate a user (login) */
    static async authenticate(username, password) {
        try {
            let res = await this.request('auth/token', { username, password }, 'post');
            if (res.error) throw new Error("Invalid credentials");

            TransconnectApi.setToken(res.token);
            return res.token;
        } catch (err) {
            console.error("Error logging in", err);
        }
    }

    /** Register a user (signup) */
    static async register(user) {
        try {
            let res = await this.request('auth/register', user, 'post');
            TransconnectApi.setToken(res.token);
            return res.token;
        } catch (err) {
            console.error("Error creating user", err);
        }
    }

    /** Edit (patch) user information */

    static async editUser(username, user) {
        try {
            let res = await this.request(`users/${username}`, user, "patch");
            return res.user;
        } catch (err) {
            console.error("error editing user information", err);
        }
    }

    static async deleteUser(username, user) {
        try {
            let res = await this.request(`users/${username}`, user, "delete");
            return res.deleted;
        } catch (err) {
            console.error("error deleting user", err);
        }
    }

    //BATHROOMS routes

    /** Get list of 50 bathrooms */

    static async getBathrooms(location = '', accessibility = false) {
        try {
            const queryParams = {
                location: location,
                accessibility: accessibility
            };

            for (const key in queryParams) {
                if (!queryParams[key]) {
                    delete queryParams[key];
                }
            }

            let res = await this.request('bathrooms', queryParams);
            return res.bathrooms;
        } catch (err) {
            console.error("error getting bathrooms", err);
            return [];
        }
    }

}

// TransconnectApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default TransconnectApi;
