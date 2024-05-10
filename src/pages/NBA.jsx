import React, { useState, useEffect } from "react";
import { Col, Container, Row, 
        Button, Table,Form, FormGroup, Input, Label} from "reactstrap";
import Query from '../components/MLBQueries';
import NBAQuery from "../components/NBAQueries";
// import DropdownMenu, {
//     DropdownItemCheckbox,
//     DropdownItemCheckboxGroup,
//   } from '@atlaskit/dropdown-menu';
import Select from 'react-select';


export default function NBA() {
    // const [requestData, setRequestData] = useState(null);

    // // let handleRequest 

    // const responseData = Temp({requestData});
    // let requestData = {table: 'ship'}
    // return(
    //     <Container className="vh-100 ">
    //         <Button>Click</Button>
    //     </Container>
    // );
    const [selectedYear, setSelectedYear] = useState({label: 'all', value: 'all'});
    const [selectedTeam1, setSelectedTeam1] = useState({ label: 'Team(s)', value: 'ALL' });
    const [selectedTeam, setSelectedTeam] = useState({ label: 'Team(s)', value: 'ALL' });
    const [selectedPosition, setSelectedPosition] = useState({ label: 'Position', value: 'all'});
    const [selectedPlayerCols, setSelectedPlayerCols] = useState([]);
    const [selectedTeamCols, setSelectedTeamCols] = useState([]);
    const [selectedColValues, setSelectedColValues] = useState([]);
    const [selectedType, setSelectedType] = useState({ label: 'Choose a Table', value: 'Players'});
    const [playoffs, setPlayoffs] = useState({ label: 'Playoffs', value: 'both'});

    const handleYearChange = (selectedOption) => {
      setSelectedYear(selectedOption);
    };
    const handleTeamChange1 = (selectedOption) => {
      setSelectedTeam1(selectedOption);
    };
    const handleTeamChange = (selectedOption) => {
      setSelectedTeam(selectedOption);
    };
    const handlePositionChange = (selectedOption) => {
      setSelectedPosition(selectedOption);
    };
    const handlePlayerCols = (selectedOption) => {
        setSelectedPlayerCols(selectedOption);
        // console.log('selected cols obj: ', selectedCols);
      };
    const handleTeamCols = (selectedOption) => {
        setSelectedTeamCols(selectedOption);
        // console.log('selected cols obj: ', selectedCols);
      };
    const handleTypeChange = (selectedOption) => {
        setSelectedType(selectedOption);
        // console.log('selected type: ', selectedType);
        setSelectedColValues([]);
      };
      
      // TEAM Stuff
    const handlePlayoffChange = (selectedOption) => {
        setPlayoffs(selectedOption);
        // console.log('selected type: ', selectedType);
      };
      
      
      useEffect(() => {
        // console.log('selCols', selectedCols);
        if (selectedPlayerCols.length > 0) {
          const selectedColValues = selectedPlayerCols.map(col => col.value);
        //   console.log('selectedColValues: ', selectedColValues);
          setSelectedColValues(selectedColValues);
        }
        if (selectedTeamCols.length > 0) {
          const selectedColValues = selectedTeamCols.map(col => col.value);
        //   console.log('selectedColValues: ', selectedColValues);
          setSelectedColValues(selectedColValues);
        }
      }, [selectedPlayerCols, selectedTeamCols]);
      
    let queryInfo;
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [requestData, setRequestData] = useState()
    const toggleTable =  () => {
        // try {
            // const requestData = { table: 'ship' };
        //     const responseData = await Temp(requestData);
        if( selectedType.value === 'Players'){
             queryInfo = {
                table: selectedType.value,
                position: selectedPosition.value,
                team: selectedTeam.value,
                cols: selectedColValues,

            };
          } else if (selectedType.value === 'Teams') {
            queryInfo = {
              table: selectedType.value,
              cols: selectedColValues,
              team: selectedTeam.value,
              year: selectedYear.value,
              playoffs: playoffs.value,
            }
          }
        
            // console.log(queryInfo.cols);
            setRequestData(queryInfo);
            setShowTable(true);
            // console.log(requestData);
        // } catch (error) {
        //     console.error('Error fetching data: ', error);
        // }
    };
    const years = ['2015', '2016', '2017', '2018', '2019', '2020',
                   '2021', '2022', '2023', '2024', 'all'].map(year => ({ label: year, value: year }));
    const positions = ['G', 'F', 'C', 'G-F', 'F-C', 'all'].map(position => ({ label: position, value: position }));
    const teams = [
        "Atl", "Bos", "Bro", "Cha",
        "Chi", "Cle", "Dal", "Den", "Det",
        "Gol", "Hou", "Ind", "Lac", "Lal",
        "Mem", "Mia", "Mil", "Min", "Nor",
        "Nyk", "Okc", "Orl", "Phi", "Pho",
        "Por", "Sac",  "San",  "Tor",
        "Uta", "Was", 'all'
    ].map(team => ({ label: team.toUpperCase(), value: team.toUpperCase() }));
    const type = ['Players', 'Teams'].map(type => ({label: type, value: type}))
    const playerCols =['TEAM','POS','AGE','GP','MPG','USG%','TO%','FTA','FT%','2PA','2P%','3PA','3P%',
        'eFG%','TS%','PPG','RPG','APG','SPG','BPG','TPG','P+R','P+A','P+R+A','VI','ORtg','DRtg','PER','OWS',
        'DWS','WS','WS/48','VORP']
    .map(col => ({ label: col, value: col.replace(/['"]+/g, '')}));
    const teamCols = ["season","lg","TEAM","playoffs",
    "age","w","l","pw","pl","mov","sos","srs","o_rtg","d_rtg","n_rtg","pace","f_tr",
    "x3p_ar","ts_percent","e_fg_percent","tov_percent","orb_percent","ft_fga",
    "opp_e_fg_percent","opp_tov_percent","opp_drb_percent","opp_ft_fga"].map(option => ({ label: option, value: option}))
    const playoff = ['yes', 'no', 'both'].map(option => ({ label: option, value: option}))

    return (
      <div>
        
        <h1 className="m-3">NBA {selectedType.value} Stats</h1>
        <Container className="w-50 d-flex align-items-center justify-content-center">
        <Select className='w-25 '
          name="tye"
          options={type}
          onChange={handleTypeChange}
          value={selectedType}
        />
        </Container>
        {selectedType.value === 'Players' ?
        <Row className="m-3 w-75 d-flex align-items-center justify-content-center">

            <Col>
                <Select
                // isMulti
                name="position"
                options={positions}
                onChange={handlePositionChange}
                value={selectedPosition}
                />
             </Col>

            <Col>
                <Select
                // isMulti
                name="team"
                options={teams}
                onChange={handleTeamChange1}
                value={selectedTeam1}
                />
             </Col>
            <Col>
                <Select
                isMulti
                name="league"
                options={playerCols}
                onChange={handlePlayerCols}
                value={selectedPlayerCols}
                />
             </Col> 
             <Col>
                 <Button onClick={toggleTable}>Get Table</Button>
            </Col>
        </Row> : 
        <Row className="m-3 w-75 d-flex align-items-center justify-content-center">

        <Col>
            <Select
            // isMulti
            name="year"
            options={years}
            onChange={handleYearChange}
            value={selectedYear}
            />
         </Col>

        <Col>
            <Select
            // isMulti
            name="team"
            options={teams}
            onChange={handleTeamChange}
            value={selectedTeam}
            />
         </Col>
        <Col>
            <Select
            name="playoffs"
            options={playoff}
            onChange={handlePlayoffChange}
            value={playoffs}
            />
         </Col> 
        <Col>
            <Select
            isMulti
            name="league"
            options={teamCols}
            onChange={handleTeamCols}
            value={selectedTeamCols}
            />
         </Col> 
         <Col>
             <Button onClick={toggleTable}>Get Table</Button>
        </Col>
    </Row> }
        {showTable &&  (
            <NBAQuery requestData={requestData} />             

        )}
      </div>
    );
}