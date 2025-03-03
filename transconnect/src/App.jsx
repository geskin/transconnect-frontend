import { useContext, useEffect } from 'react'
import './css/App.css'
import { BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar';
import RoutesList from './RoutesList';
import UserContext from './UserContext';
import { useLocalStorage } from './hooks';
import TransconnectApi from './api';
import { jwtDecode } from 'jwt-decode';

function App() {
  const { currUser, setCurrUser } = useContext(UserContext);
  const [token, setToken] = useLocalStorage(null, 'token');

  useEffect(() => {
    if (token) {
      TransconnectApi.token = token; // set token globally
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setCurrUser(null);
      return;
    }

    let payload = jwtDecode(token);
    console.debug(payload);
    const { username, role } = payload; // Extract username and role from the token

    // Set the current user with username and role
    setCurrUser({ username, role });

    console.debug(currUser);
  }, [token]);

  // Fetch additional user details on current user only after currUser is set
  useEffect(() => {
    if (!currUser || !currUser.username) return; // Wait until currUser is fully initialized

    const fetchUser = async () => {
      try {
        const user = await TransconnectApi.getUser(currUser.username);
        setCurrUser((prevUser) => ({
          ...prevUser,
          ...user, // Merge fetched data into the current user state
        }));
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    };

    fetchUser();
    console.debug(currUser);
  }, [currUser?.username]);

  const login = async (username, password) => {
    try {
      const data = await TransconnectApi.authenticate(username, password);
      setToken(data);
    } catch (err) {
      console.error("Error authenticating user", err);
    }
  }

  const signup = async (user) => {
    try {
      const data = await TransconnectApi.register(user);
      setToken(data);
    } catch (err) {
      console.error("Error registering user", err);
    }
  }

  const logout = () => {
    setToken(null);
    setCurrUser(null);
  }

  const editUser = async (user) => {
    try {
      const username = currUser.username;
      const updatedUser = await TransconnectApi.editUser(username, user);
      setCurrUser(updatedUser);
    } catch (err) {
      console.error("Error updating user", err);
    }
  }

  const createPost = async (post) => { //make this generalizable for posts and resources
    try {
      const data = await TransconnectApi.createPost(post);
      console.debug(data);
    } catch (err) {
      console.error("Error creating post", err);
    }
  }

  const submitResource = async (resource) => {
    try {
      const data = await TransconnectApi.submitResource(resource);
      console.debug(data);
    } catch (err) {
      console.error("Error submitting resource", err);
    }
  }

  const updateResource = async (resourceId, resource) => {
    try {
      const data = await TransconnectApi.patchResource(resourceId, resource);
      console.debug(data);
    } catch (err) {
      console.error("Error updating resource", err);
    }
  }

  const editPost = async (postId, post) => {
    try {
      const data = await TransconnectApi.editPost(postId, post);
      console.debug(data);
    } catch (err) {
      console.error("Error updating post", err);
    }
  }

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <main>
          <RoutesList signup={signup} login={login} logout={logout} editUser={editUser} createPost={createPost} submitResource={submitResource} updateResource={updateResource} editPost={editPost} />
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
