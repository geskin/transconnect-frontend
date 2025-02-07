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

    // Individual API routes

    /** Get all posts
     * optionally filter by tag
     */

    static async getPosts(tag = '') {
        const queryParams = tag ? { tag: tag } : {};
        let res = await this.request('posts', queryParams);
        return res.posts;
    }

    /** Make a post */

    static async createPost(post) {
        let res = await this.request('posts', post, 'post');
        return res.post;
    }

    static async editPost(postId, post) {
        let res = await this.request(`posts/${postId}`, post, 'patch');
        return res.post;
    }

    /** Get the comments on a post */

    static async getComments(postId) {
        let res = await this.request(`posts/${postId}/comments`);
        return res.comments;
    }

    /** Make a comment */

    static async createComment(postId, comment) {
        let res = await this.request(`posts/${postId}/comments`, comment, 'post');
        return res.comment;
    }

    /** Edit (patch) a comment */

    static async editComment(postId, commentId, comment) {
        let res = await this.request(`posts/${postId}/comments/${commentId}`, comment, "patch");
        return res.comment;
    }

    //AUTH and USER

    /** Get user by username. */

    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Register a user (signup) */

    static async register(user) {
        let res = await this.request('auth/register', user, 'post');
        return res.token;
    }

    /** Authenticate a user (login) */

    static async authenticate(username, password) {
        let res = await this.request('auth/token', { username, password }, 'post');
        return res.token;
    }

    /** Edit (patch) user information */

    static async editUser(username, password, email) {
        let res = await this.request(`users/${username}`, { username, password, email }, "patch");
        return res.user;
    }

}

// for now, put token ("testuser" / "password" on class)
TransconnectApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
    "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
    "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default TransconnectApi;
