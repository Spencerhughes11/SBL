import React from "react";
import { useState} from "react";
import { Container, Form, Label, Input, Button } from "reactstrap";
import './login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/UserContext.js";
import Header from "../components/Header.js";


function Login(props) {
    let navigate = useNavigate();
  

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    
    const {login} = useAuth();


    function handleLogin(e) {e.preventDefault(); }

    function handlesignup() {navigate('/signup');}

    function loginuser() {login(username, password); }

    return (
        <div>
        <div>
            <Header  />
        </div>
        <Container className="popup">
            <div className="popup-inner">
                    <Form onSubmit={handleLogin}>
                    <h2>Login</h2>

                        <Label>
                            Username:
                            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        </Label>
                        <Label>
                            Password:
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Label>
                        <span onClick={handlesignup} style={{ display: 'block', cursor: 'pointer', textDecoration: 'underline' }}>Don't have an account? Sign up here</span>
                        <Button onClick={loginuser} type="submit">Login</Button>
                    </Form>
                <button type="close" onClick={props.toggle}>Close</button>
                
            </div>
        </Container>
    </div>
    )
}
export default Login