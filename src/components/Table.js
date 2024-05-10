import React, { useState , useEffect} from 'react';
import { useTable, useSortBy } from 'react-table';
import { Container, Table, Button, Modal, ModalHeader, 
        ModalBody,ModalFooter, CardBody, CardText} from 'reactstrap';

import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

import { useNavigate } from "react-router-dom";


function SortableTableFunc({ columns, data, selectedValue, setselectedValue }) {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        const initialState = JSON.parse(saved) || [];
        return initialState;
    });
    const [res, setRes] = useState(null);
    let navigate = useNavigate();

    const setFav = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/setfavplayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const res = await response.json();
            setRes(res);
            if (res.error) {
                navigate('/nba');
                alert(res.error);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    const setteamFav = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/setfavteam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const res = await response.json();
            setRes(res);
            if (res.error) {
                navigate('/nba');
                alert(res.error);
            } 

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };


    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);
    
    const toggleFavorite = () => {
        if (favorites.includes(selectedValue.NAME)) {
            setFavorites(favorites.filter(NAME => NAME !== selectedValue.NAME));
            let user = sessionStorage.getItem('user');
            let userData = JSON.parse(user);
            let username = userData.username;
            let userID = userData.id;
            if (selectedValue.id === undefined){
                let removeDATA = {
                    userID: userID,
                    username: username,
                    teamID: selectedValue.team_id,
                    type: 'remove'
                }
                setteamFav(removeDATA);

            } else{
            let removeDATA = {
                userID: userID,
                username: username,
                playerID: selectedValue.id,
                type: 'remove'
            }
            setFav(removeDATA);
            }
        } else {
            
            setFavorites([...favorites, selectedValue.NAME]);
            let user = sessionStorage.getItem('user');
            let userData = JSON.parse(user);
            let userID = userData.id;
            let username = userData.username;
            if(selectedValue.id === undefined){
            let favDATA = {
                
                userID: userID,
                username: username,
                teamID: selectedValue.team_id,
                type: 'add'

            };
            setteamFav(favDATA);   
        } else{
            let favDATA = {
                userID: userID,
                username: username,
                playerID: selectedValue.id,
                type: 'add'

            };
            setFav(favDATA);

        }

        }

    };
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy);

    return (
        <Container>
    <Table hover striped  {...getTableProps()}>
            <thead  style={{ borderRadius: '5px', backgroundColor: '#f8f9fa', color: '#333' }}>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                            <td {...cell.getCellProps()}>
                                {cell.column.id === 'NAME' ? (  
                                    <Button size='sm' color='link' onClick={() => setselectedValue(row.original)}>
                                    {cell.render('Cell')}
                                </Button>
                                ) : (
                                    cell.render('Cell')
                                )}
                            </td>
                        ))}

                        </tr>
                    );
                })}
            </tbody>
        </Table>

        <Modal isOpen={selectedValue !== null} toggle={() => setselectedValue(null)} >
            <ModalHeader toggle={() => setselectedValue(null)}>{selectedValue?.NAME}  -  {selectedValue?.TEAM}</ModalHeader>
            <ModalBody>
           
            {selectedValue?.id !== undefined ? (
                 <CardBody className='p-3'> 
                    <CardText>
                    PPG: {selectedValue?.PPG}
                    </CardText>
                    <CardText>
                    RPG: {selectedValue?.RPG} 
                    </CardText>
                    <CardText>
                    APG: {selectedValue?.APG}
                    </CardText>
                </CardBody>
            ) : (
                <CardBody className='p-3'> 
                    <CardText>
                        W: {selectedValue?.w}
                        </CardText>
                        <CardText>
                        L: {selectedValue?.l} 
                        </CardText>
                        <CardText>
                        Playoffs: {selectedValue?.playoffs}
                        </CardText>
                    </CardBody>
                )}
            </ModalBody>
            <ModalFooter>
            
        {selectedValue && favorites.includes(selectedValue.NAME) ? 
          <MdFavorite size={50} onClick={() => toggleFavorite(selectedValue?.NAME,selectedValue?.TEAM,selectedValue?.PPG,selectedValue?.RPG,selectedValue?.APG) } color='#e31b23'/> :
          <MdFavoriteBorder size={50} onClick={toggleFavorite} color='#e31b23'/> }

        </ModalFooter>
        </Modal>
        </Container>
    );
}

export default function SortableTable({ responseData }) {
    const columns = React.useMemo(() => responseData.columns.map(col => ({
        Header: col,
        accessor: col,
    })), [responseData.columns]);
    const [selectedValue, setselectedValue] = useState(null);
    const data = React.useMemo(() => responseData.data, [responseData.data]);

    return (
        <div style={{width: '15%', margin: '2em'}}>
   
           <SortableTableFunc 
                columns={columns} 
                data={data} 
                selectedValue={selectedValue} 
                setselectedValue={setselectedValue}
            />

        </div>
    );
}
