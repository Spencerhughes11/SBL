import React, { useState, useEffect } from "react";
import { Col, Container, Row, 
        Button} from "reactstrap";

import Select from 'react-select';
import Userjoin from "../components/communityquery";


export default function Community() {
  const [selectedUser, setSelectedUser] = useState({ label: 'User..', value: 'ALL' });
  const [showTable, setShowTable] = useState(false);
  const [requestData, setRequestData] = useState();
  const [selectedType, setSelectedType] = useState({ label: 'Choose a Table', value: 'Players'});

const [users, setUsers] = useState([]);


useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/retrieveusers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'SELECT username FROM users' }),
        });
            const data = await response.json();

            const user = JSON.parse(sessionStorage.getItem('user')) || {};
            const loggedInUser = user.username || '';
            // filter out logged in username from list
            const trimmedUsers = data.filter(user => user.username !== loggedInUser);

            setUsers(trimmedUsers);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    fetchData();
  
}, []);


let queryInfo;

  const handleUserChange = (selectedOption) => setSelectedUser(selectedOption);
  const handleTypeChange = (selectedOption) => setSelectedType(selectedOption);
  let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : '';
  let username = user.username;
    const toggleTable =  () => {

        queryInfo = {
          currUser: username,
          otherUser: selectedUser.value,
          table: selectedType.value
        }
        setRequestData(queryInfo);
        setShowTable(true);

    };


    const type = ['Players', 'Teams'].map(type => ({label: type, value: type}))

    return (
      <div>
      
        <h1 className="m-3">Community</h1>
        <h4 className="">See who other users favorite teams and players are</h4>
        <Container className="w-50 d-flex align-items-center justify-content-center">
        <Select className='w-25 '
          name="tye"
          options={type}
          onChange={handleTypeChange}
          value={selectedType}
        />
        </Container>
        <Row className="m-3 w-75 d-flex align-items-center justify-content-center">
            <Col>
                <Select
                name="user"
                options={users.map(user => ({ label: user.username, value: user.username }))}
                onChange={handleUserChange}
                value={selectedUser}   
                />
             </Col>

             <Col>
                 <Button onClick={toggleTable}>Get Table</Button>
            </Col>
        </Row>
        {showTable && (
            <Userjoin requestData={requestData} />          
        )}
      </div>
    );
}