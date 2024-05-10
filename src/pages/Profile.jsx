import React, {useState, useEffect} from 'react';
import {Container, Input} from 'reactstrap';




export default function Profile() {
    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : '';
    let username = user.username;
    let firstName = user.first;
    let lastName = user.last;
    const [favoritePlayers, setFavoritePlayers] = useState([]);
    const [favoriteTeams, setFavoriteTeams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await fetch('http://127.0.0.1:5000/retrievefavs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username}),
            });
                const data = await response.json();
    
                setFavoritePlayers(data.players);
                setFavoriteTeams(data.teams);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
    
        fetchData();
      
    }, []);
    

    return (
<Container className='d-flex w-50 h-75 bg-white rounded raised mt-5 justify-content-center '>
    <Container className='mt-5'>
        <h1>Profile</h1> 
         <hr/>
        <Container className='p-4 text-start d-flex justify-content-center'>
        </Container>
        
        <Container className='p-4 justify-content-center'>
                    <h4>Username: <code>{username}</code></h4>
                    <br/>
                    <h4>Name: <code>{firstName} {lastName}</code> </h4><br/>
                    <h4>Favorite Teams:</h4>
                        {favoriteTeams.map((team, index) => (
                        <code key={index}>{team.NAME}, </code>
                        ))}
                    <h4>Favorite Players:</h4>
                    {favoritePlayers.map((player, index) => (
                    <code key={index}>{player.NAME}, </code>
                    ))}
                </Container>
            </Container>
        </Container>
    );
}

