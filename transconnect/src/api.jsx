import axios from "axios";
import process from "process";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class TransconnectApi {
    // the token for interactive with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${TransconnectApi.token}` };
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

    /** Individual API routes */

    //RESOURCES routes

    /** Get all resources
     * optionally filter by type
     */

    static async getResources(types = []) {
        try {
            const queryParams = types ? { types: types } : {};
            let res = await this.request('resources', queryParams);
            return res.resources;
        } catch (err) {
            console.error("error fetching resources", err);
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
            let res = await this.request(`resources/${id}`, approved, 'patch');
            return res.resource;
        } catch (err) {
            console.error("error changing approval status", err);
        }
    }

    //POSTS routes

    /** Get all posts
     * optionally filter by tag
     */

    static async getPosts(tags = []) { // tag = [] given an array of tags 
        try {
            const queryParams = tags ? { tags: tags } : {};
            let res = await this.request('posts', queryParams);
            return res.posts;
        } catch (err) {
            console.error("error fetching posts", err);
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

    static async editPost(postId, post) {
        try {
            let res = await this.request(`posts/${postId}`, post, 'patch');
            return res.post;
        } catch (err) {
            console.error("error editing post", err);
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

    /** Make a comment */

    static async createComment(postId, comment) {
        try {
            let res = await this.request(`posts/${postId}/comments`, comment, 'post');
            return res.comment;
        } catch (err) {
            console.error("error creating comment", err);
        }
    }

    /** Edit (patch) a comment */

    static async editComment(postId, commentId, comment) {
        try {
            let res = await this.request(`posts/${postId}/comments/${commentId}`, comment, "patch");
            return res.comment;
        } catch (err) {
            console.error("error editing comment", err);
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

    /** Register a user (signup) */

    static async register(user) {
        try {
            let res = await this.request('auth/register', user, 'post');
            return res.token;
        } catch (err) {
            console.error("error creating user", err);
        }
    }

    /** Authenticate a user (login) */

    static async authenticate(username, password) {
        try {
            let res = await this.request('auth/token', { username, password }, 'post');
            return res.token;
        } catch (err) {
            console.error("error loging user in (error creating token)", err);
        }
    }

    /** Edit (patch) user information */

    static async editUser(username, password, email) {
        try {
            let res = await this.request(`users/${username}`, { username, password, email }, "patch");
            return res.user;
        } catch (err) {
            console.error("error editing user information", err);
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

            // Remove any empty query parameters
            for (const key in queryParams) {
                if (queryParams[key] === '') {
                    delete queryParams[key];
                }
                if (queryParams[key] === false) {
                    delete queryParams[key];
                }
            }

            let res = await this.request('bathrooms', queryParams);
            return res.bathrooms;
        } catch (err) {
            console.error("error getting bathrooms", err);
        }
    }

}

TransconnectApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default TransconnectApi;
