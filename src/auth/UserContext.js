import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import Format from '../components/Format';

export const UserContext = createContext();

export function useAuth() {
    return useContext(UserContext);
}

export function UserProvider (props) {
    let auth = useAuth();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = sessionStorage.getItem('user');
        if (loggedInUser) {

        }
    }, [user]);

    const login = async (username, password) => {
        let userData = {
            username: username,
            password: password,
            method: 'login'
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const res = await response.json();
            if (res.error) {
                alert(res.error);
            } else {
                setUser(res.user.username);
                setIsLoggedIn(true);
                sessionStorage.setItem('user', JSON.stringify(res.user));
                console.log(res);
                console.log('usersession: ', sessionStorage.getItem('user'));
                navigate('/', {replace: true});

            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }
    

    const register = async (first, last, username, password) => {
        // create new user in the user table
        let userData = {
            first: first,
            last: last,
            username: username,
            password: password,
            method: 'signup'
        }

    }

    const value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        login,
        register
    }
    return (
        <UserContext.Provider value={value}>
        {props.children}
        </UserContext.Provider>
    );
};


export function RequireUser() {
    let auth = useAuth();
    let location = useLocation();
    

    return auth ? (
      <Format>
        <Outlet />
      </Format>
    ) : (
      <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
  }
  
  