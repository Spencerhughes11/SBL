import React from 'react';
import Select from 'react-select';

const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', 'all'].map(year => ({ label: year, value: year }));

const Test = () => {
  const [selectedYears, setSelectedYears] = React.useState(['2024']);

  const handleChange = (selectedOptions) => {
    setSelectedYears(selectedOptions);
  };

  return (
    <div>
      <Select
        // isMulti
        name="years"
        options={years}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
        value={selectedYears}
      />
    </div>
  );
};

export default Test;
