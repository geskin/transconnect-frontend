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
    const { username, role } = payload; // Extract username and isAdmin from the token

    // Set the current user with username and isAdmin
    setCurrUser({ username, role });
  }, [token]);

  // Fetch additional user details only after curr_user is set
  useEffect(() => {
    if (!currUser || !currUser.username) return; // Wait until curr_user is fully initialized

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

  return (
    <>
      <BrowserRouter>
        <NavBar currUser={currUser} />
        <main>
          <RoutesList signup={signup} login={login} logout={logout} />
        </main>
      </BrowserRouter>
    </>
  )
}

export default App
