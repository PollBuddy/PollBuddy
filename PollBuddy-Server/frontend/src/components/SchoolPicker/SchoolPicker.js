import React, { Component } from "react";
import Autocomplete from "react-autocomplete";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class SchoolPicker extends Component {

  constructor(props) {
    super(props);
    this.sortItems = this.sortItems.bind(this);
    this.renderDropdownItem = this.renderDropdownItem.bind(this);

    this.state = {
      "schoolInfo": {
        "schools": [],
        "schoolLinkDict": {}
      }
    };

  }

  componentDidMount(){
    console.log("CCC");
    console.log(this.props);
    console.log(this.props.schoolInfo);
    if (this.props.schoolInfo == null) {
      fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
        method: "GET",
        headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      }    ).then(response => response.json())
      // handle response
      .then(data => {
        console.log(data); // for testing, can be deleted later
        let schools = this.state.schoolInfo.schools;
        let schoolLinkDict = this.state.schoolInfo.schoolLinkDict;
        for (var i = 0; i < data.length; i++) {
          schools.push({ key: i, label: data[i][0] });
          schoolLinkDict[data[i][0]] = data[i][1];
        }
        this.setState({"schoolInfo": {"schools": schools, "schoolLinkDict": schoolLinkDict}})
        console.log(schools); // for testing, can be deleted later
        console.log(schoolLinkDict); // for testing, can be deleted later
        console.log("AAA");
        //Abby note to self Fri 18th: return schools & schoolLinkDict in one data structure
        //so it's easier to pass around
        this.props.onDoneLoading(this.state.schoolInfo);
      });
    } else {
      // Get info that was passed in
      this.setState({"schoolInfo": this.props.schoolInfo});
    }
  }

  sortItems(itemA, itemB, value) {
    const lowA = itemA.label.toLowerCase();
    const lowB = itemB.label.toLowerCase();
    const indexA = lowA.indexOf(value.toLowerCase());
    const indexB = lowB.indexOf(value.toLowerCase());
    if (indexA !== indexB) {
      return (indexA - indexB);
    }
    return (lowA < lowB ? -1 : 1);
  }

  renderDropdownItem(item) {
    return(
      <div key={item.key} className="auto_comp">
        {item.label}
      </div>
    );
  }

  render() {
     return (
      <MDBContainer className="form-group">
        <Autocomplete
          items={this.state.schoolInfo.schools}
          sortItems={this.sortItems}
          getItemValue={item => item.label}
          shouldItemRender={(item, value2) => item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0}
          inputProps={{
            className: "form-control textBox",
            placeholder: "Enter school name",
            "aria-labelledby": "schoolNameText"
          }}
          wrapperStyle={{ display: "block" }}
          value={this.props.value}
          onChange={this.props.onChange}
          onSelect={this.props.onSelect}
          renderItem={this.renderDropdownItem}
        />
      </MDBContainer>
    );
  }
}

