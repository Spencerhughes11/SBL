import React, { useState, useEffect } from "react";

    import SortableTable from "./Table";

export default function Query(queryData) {
    const [responseData, setResponseData] = useState(null);

    const fetchData = async (requestData) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/mlb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });
            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };
    // TEST
    const requestData = {
        query: (queryData.requestData.year === 'all') ? 
            'SELECT * FROM stats LIMIT 15' : 
            `SELECT * FROM stats WHERE year = ${queryData.requestData.year} LIMIT 15`
    };
    
    useEffect(() => {
        fetchData(requestData);
    }, [queryData]); 

    if (!responseData) {
        return <div>Loading...</div>;
    }

    return (
        <SortableTable responseData={responseData} />
       
    );
}
