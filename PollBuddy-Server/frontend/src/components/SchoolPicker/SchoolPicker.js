import React, { useEffect, useState } from "react";
import Autocomplete from "react-autocomplete";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

let schoolLinkDict = {};

const sortItems = (itemA, itemB, value) => {
  const lowA = itemA.label.toLowerCase();
  const lowB = itemB.label.toLowerCase();
  const indexA = lowA.indexOf(value.toLowerCase());
  const indexB = lowB.indexOf(value.toLowerCase());
  if (indexA !== indexB) {
    return (indexA - indexB);
  }
  return (lowA < lowB ? -1 : 1);
};

const renderDropdownItem = (item) => (
  <div key={item.key} className="auto_comp">
    {item.label}
  </div>
);

// Default Component
export default ({ value, onChange, onSelect}) => {
  // Create reactive variables
  var [schools, setSchools] = useState([]);
  var [localSchoolLinkDict, setLinkDict] = useState({});

  // On mount
  useEffect(() => {
    // Fetch from schools route then unwrap json
    fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
      method: "GET",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
    }).then(response => response.json())
      // handle response
      .then(data => {
        // set schools and data accordingly
        console.log(data); // for testing, can be deleted later
        for (var i = 0; i < data.length; i++) {
          setSchools(schools.push({ key: i, label: data[i][0] }));
          schoolLinkDict[data[i][0]] = data[i][1];
          setLinkDict(schoolLinkDict);
        }
        console.log(schools); // for testing, can be deleted later
        console.log(schoolLinkDict); // for testing, can be deleted later
      });
  }, []);

  return (
    <MDBContainer className="form-group">
      <Autocomplete
        items={schools}
        sortItems={sortItems}
        getItemValue={item => item.label}
        shouldItemRender={(item, value2) => item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0}
        inputProps={{
          className: "form-control textBox",
          placeholder: "Enter school name",
          "aria-labelledby": "schoolNameText"
        }}
        wrapperStyle={{ display: "block" }}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        renderItem={renderDropdownItem}
      />
    </MDBContainer>
  );
};

export {schoolLinkDict};
