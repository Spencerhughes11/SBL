import React, { useState, useEffect } from "react";
import SortableTable from "./Table";


export default function Retreiveusers({ requestData }) {
    const [responseData, setResponseData] = useState(null);


    const fetchData = async (queryData) => {
        try {

            const response = await fetch('http://127.0.0.1:5000/getfavplayer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(queryData),
            });
            const data = await response.json();
            setResponseData(data);

        } catch (error) {
            console.error('Error fetching data: ', error);

        }
    };

    useEffect(() => {
          fetchData(requestData);
      }, []);

      if (!responseData) {
        return <div>Loading...</div>;
    }
    return (
        <SortableTable responseData={responseData} />

    );
}