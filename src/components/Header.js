import React, {  } from "react";
import {
  Navbar,
  Nav,
  NavbarText, Container
} from "reactstrap";
import { NavLink, useNavigate } from 'react-router-dom';




export default function Header() {
  let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : '';
  let firstName = user.first;
  let lastName = user.last;

  let navigate = useNavigate();

  function logout() {
    console.log("userhome", sessionStorage.getItem('user'));
  
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('profilePic');
    sessionStorage.removeItem('favorites');
    localStorage.removeItem('favorites');
    console.log("userhome", sessionStorage.getItem('user'));
    navigate('/login', {replace: true});
  };

  return (
    <div>
      <Navbar dark color="primary" expand="lg" container="fluid" className="mb-2 p-2">
       
        <Nav className="mr-auto justify-content-space-between" navbar>
          <Container className="mr-5">
            <NavLink className='text-light' to="/">Home</NavLink>
          </Container>

          <Container>
            <NavLink className='text-light' to="/nba">NBA</NavLink>
          </Container>
          <Container>
            <NavLink className='text-light' to="/community">COMMUNITY</NavLink>
          </Container>

        </Nav>
          {sessionStorage.getItem('user') ? 
          <Nav navbar className="d-flex m-auto align-items-center justify-content-center">
            <NavbarText className="text-">Welcome, {firstName} {lastName}! </NavbarText>
          </Nav>
           :     <Nav navbar className="d-flex m-auto align-items-center justify-content-center">
          <NavbarText>Login to access</NavbarText>
        </Nav>}
        <Nav className="mr-auto justify-content-space-between" navbar>
          <Container className="mr-5">
            <NavLink className='text-light' to="/profile" >Profile</NavLink>
          </Container>
          <Container className="mr-5">
            <NavLink className='text-light' to="/login" onClick={logout}>Logout</NavLink>
          </Container>

        </Nav>

      </Navbar>
    </div>
  );
}
