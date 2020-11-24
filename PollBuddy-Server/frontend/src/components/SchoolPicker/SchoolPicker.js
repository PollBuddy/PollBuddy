import React from "react";
import Autocomplete from "react-autocomplete";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

// TODO: This will need to pull from the database in the near future
// const schools = [
//   {key: 0, label: "Rensselaer Polytechnic Institute"},
//   {key: 1, label: "Worcester Polytechnic Institute"},
//   {key: 2, label: "Massachusetts Institute of Technology"},
//   {key: 3, label: "Rochester Institute of Technology"},
//   {key: 4, label: "University of Rochester"},
//   {key: 5, label: "SUNY Polytechnic Institute"},
//   {key: 6, label: "SUNY Albany"},
//   {key: 7, label: "Albany Medical College"}
// ];

var schools = [];
var schoolLinkDict = {};

fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
  method: "GET",
  headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
}).then(response => response.json())
  // handle response
  .then(data => {
    console.log(data); // for testing, can be deleted later
    schoolLinkDict = data;
    const schoolNames = Object.keys(data);
    console.log(schoolNames); // for testing, can be deleted later
    for (var i = 0; i < schoolNames.length; i++) {
      schools.push({ key: i, label: schoolNames[i] });
    }
    console.log(schools); // for testing, can be deleted later
  })

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

export default ({ value, onChange, onSelect}) => (
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

export {schoolLinkDict};
