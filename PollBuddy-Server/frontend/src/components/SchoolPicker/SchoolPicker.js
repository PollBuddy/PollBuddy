import React from "react";
import Autocomplete from "react-autocomplete";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import "../../components/LoadingWheel/LoadingWheel.scss";


var schools = [];
var schoolLinkDict = {};

fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
  method: "GET",
  headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
}).then(response => response.json())
  // handle response
  .then(data => {
    console.log(data); // for testing, can be deleted later
    for (var i = 0; i < data.length; i++) {
      schools.push({ key: i, label: data[i][0] });
      schoolLinkDict[data[i][0]] = data[i][1];
    }
    console.log(schools); // for testing, can be deleted later
    console.log(schoolLinkDict); // for testing, can be deleted later
  });

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

const checkWheel = () => {
  if (Object.keys(schoolLinkDict).length < 1) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  } else {
    return;
  }
};

export default ({ value, onChange, onSelect}) => (

  <MDBContainer className="form-group">
    <Autocomplete
      items={schools}
      sortItems={sortItems}
      getItemValue={item => item.label}
      shouldItemRender={(item, value2) => item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0}
      onMenuVisibilityChange={open}
      inputProps={{
        className: "LoadingWheel-loader"
      }}
      wrapperStyle={{style: "LoadingWheel-loader"}}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      renderItem={renderDropdownItem}
    />
  </MDBContainer>
);

export {schoolLinkDict};
