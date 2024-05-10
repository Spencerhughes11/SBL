import React from "react";
import { useState} from "react";
import { Container, Form, FormFeedback, FormGroup,
        Label, Input } from "reactstrap";
import './login.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.js";


export default function SignUp() {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const [res, setRes] = useState(null);
    const [touched, setTouched] = useState(false);
  
    
   

    const tooShort = password.length < 4;
    let notMatching = false;
    if (password !== confirmPassword) {
        notMatching = true;
    }


    const handleBlur = () => setTouched(true);

    const fetchData = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const res = await response.json();
            setRes(res);
            if (res.error) {
                navigate('/signup');
                alert(res.error);
            } else {
                navigate('/login');
            }

            console.log('res: ', res);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

 
    
    function handlesignup() {
        // setShowsignup(!showSignUp);
        navigate('/login');
        
    }

    function registeruser() {
        // create new user in the user table
        let userData = {
            first: first,
            last: last,
            username: username,
            password: password,
            method: 'signup'
        }
        fetchData(userData);
    }

    return (
        <div>
        <div>
            <Header  />
        </div>
        <Container className="popup">
            <div className="popup-inner">

                    <Form className='sign' onSubmit={handlesignup}>
                        <h2 className="mb-4">Sign Up</h2>
                        <Label className="text-start">
                            First Name
                            <Input placeholder="Example" type="text" value={first} onChange={e => setFirst(e.target.value)} />
                        </Label>                        
                        <Label className="mt-4 mb-4 text-start">
                            Last Name
                            <Input  placeholder="Name" type="text" value={last} onChange={e => setLast(e.target.value)} />
                        </Label>
                        <Label className="mt-4 mb-4 text-start">
                            Create a Username
                            <Input  placeholder="beerdrinker447" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        </Label>

                        
                        <FormGroup>
                        <Label className="mt-4 mb-4 text-start">
                            Create a Password
                                <Input type="password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    invalid={touched && tooShort} 
                                    onBlur={handleBlur} 

                                />
                                {tooShort && touched &&(
                                <FormFeedback>Password must be at least 8 characters long</FormFeedback>
                                )}
                            </Label>
                        </FormGroup>
                        <FormGroup>
                        <Label className="mt-4 mb-4 text-start">
                            Confirm Your Password
                                <Input type="password" 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    invalid={touched && notMatching} 
                                    onBlur={handleBlur} 

                                />

                                {notMatching &&(
                                <FormFeedback>Passwords must match</FormFeedback>
                                )}
                            </Label>
                        </FormGroup>
                        <span onClick={handlesignup} style={{ display: 'block', cursor: 'pointer', textDecoration: 'underline' }}>Have an account? Log in here</span>
                        <button onClick={registeruser} type="submit">Sign Up</button>
                    </Form>
                
                
            </div>
        </Container>
        </div>
    
    )

}
