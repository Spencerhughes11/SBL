import React, { useState } from "react";
import { Col , Row, 
        Button} from "reactstrap";
import Query from '../components/MLBQueries';

import Select from 'react-select';


export default function MLB() {

    const [selectedYear, setSelectedYear] = useState({label: '2024', value: '2024'});
    const [selectedTeam, setSelectedTeam] = useState({ label: 'Kansas City Royals', value: 'Kansas City Royals' });
    const [selectedPositions, setSelectedPosition] = useState();
    const [selectedCols, setSelectedCols] = useState([]);

    const handleYearChange = (selectedOption) => {
      setSelectedYear(selectedOption);
    };
    const handleTeamChange = (selectedOption) => {
      setSelectedTeam(selectedOption);
    };
    const handlePositionChange = (selectedOption) => {
      setSelectedPosition(selectedOption);
    };
    const handleColsChange = (selectedOption) => {
      setSelectedCols(selectedOption);
    };
  
    const [showTable, setShowTable] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [requestData, setRequestData] = useState()
    const toggleTable =  () => {
            let queryInfo = {
                year: selectedYear.value,
            }
            setRequestData(queryInfo);
            setShowTable(true);
    };
    const years = ['2015', '2016', '2017', '2018', '2019', '2020',
                   '2021', '2022', '2023', '2024', 'all'].map(year => ({ label: year, value: year }));
    const teams = [
        "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox",
        "Chicago White Sox", "Chicago Cubs", "Cincinnati Reds", "Cleveland Guardians",
        "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals",
        "Los Angeles Angels","Los Angeles Dodgers","Miami Marlins", "Milwaukee Brewers",
        "Minnesota Twins", "New York Yankees", "New York Mets", "Oakland Athletics",
        "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants",
        "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays",
        "Washington Nationals"].map(team => ({ label: team, value: team }));

    const cols = ['year', 'p_game', 'p_formatted_ip', 'ff_avg_speed', 'ff_avg_spin',
             'sl_avg_spin', 'cu_avg_spin'].map(col => ({ label: col, value: col }));
    return (
      <div>
      
        <h1 className="m-4">MLB Stats</h1>
        <Row className="m-3 w-75 d-flex align-items-center justify-content-center">
            <Col>
                <Select
                name="position"
                options={[
                    {label: 'Hitters', value: 'stats'},
                    {label: 'Pitchers', value: 'stats'}
                ]}
                onChange={handlePositionChange}
                value={selectedPositions}
                />
             </Col>
            <Col>
                <Select
                name="years"
                options={years}
                onChange={handleYearChange}
                value={selectedYear}
                />
             </Col>
            <Col>
                <Select
                name="team"
                options={teams}
                onChange={handleTeamChange}
                value={selectedTeam}
                />
             </Col>
            <Col>
                <Select
                isMulti
                name="league"
                options={cols}
                onChange={handleColsChange}
                value={selectedCols}
                />
             </Col>
             <Col>
                 <Button onClick={toggleTable}>Get Table</Button>
            </Col>
        </Row>
        {showTable &&  (
            <Query requestData={requestData} />             

        )}
      </div>
    );
}