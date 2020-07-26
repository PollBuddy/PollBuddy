import React, {Component} from "react";
import Autocomplete from "react-autocomplete";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class Contact extends Component {

  componentDidMount() {
    this.props.updateTitle("Contact Us");
  }

  constructor(props) {
    super(props);
    this.state = { value: "N/A" }
  }

  render() {
    return(
      <MDBContainer fluid className="page">
        <p className="bold fontSizeLarge">
          Looking to get in touch with a developer? Shoot an email over to
          {' '}<em><a href="mailto:contactus@pollbuddy.app">
            contactus@pollbuddy.app
          </a></em>{' '}
          or use the form below to file a support ticket.
        </p>
        <p className="width-90 fontSizeSmall">
          Alternatively, it would be greatly appeciated if you reported technical
          problems, such as bugs or design complaints/suggestions, by
          {' '}<em><a href="https://github.com/PollBuddy/PollBuddy/issues/new/choose">
            opening an issue
          </a></em>{' '}
          on our
          {' '}<em><a href="https://github.com/PollBuddy/PollBuddy">
            GitHub repository.
          </a></em>{' '}
        </p>
        <MDBContainer fluid className="box">
          <label className="width-90 fontSizeSmall" for="name">
            First and last name:
          </label>
          <MDBContainer className="form-group">
            <input className="form-control textBox" id="name" placeholder="Name"/>
          </MDBContainer>
          <label className="width-90 fontSizeSmall" for="school">
            School (if applicable):
          </label>
          <MDBContainer className="form-group" style={{ width: "100%" }}>
            <Autocomplete
              items={[
                { key: 0, label: "N/A"},
                { key: 1, label: "Rensselaer Polytechnic Institute" },
                { key: 2, label: "Worcester Polytechnic Institute" },
                { key: 3, label: "Massachusetts Institute of Technology" },
                { key: 4, label: "Rochester Institute of Technology" },
                { key: 5, label: "University of Rochester" },
                { key: 6, label: "SUNY Polytechnic Institute" },
                { key: 7, label: "SUNY Albany" },
                { key: 8, label: "Albany Medical College" }
              ]}
              getItemValue={item => item.label}
              sortItems={(itemA, itemB, value) => {
                if(itemB.label === "N/A") {
                  return 99;
                }
                const lowA = itemA.label.toLowerCase();
                const lowB = itemB.label.toLowerCase();
                const indexA = lowA.indexOf(value.toLowerCase());
                const indexB = lowB.indexOf(value.toLowerCase());
                if(indexA !== indexB) {
                  return (indexA - indexB);
                }
                return (lowA < lowB ? -1 : 1);
              }}
              shouldItemRender={(item, value) =>
                (item.label.toLowerCase().indexOf(value.toLowerCase()) >= 0) || item.label === "N/A"
              }
              renderItem={(item, isHighlighted) =>
                <div
                  key={item.key}
                  className="fontSizeSmall"
                  style={{
                    background: isHighlighted ? "#DFCFEA" : "#FFF",
                    fontFamily: "monospace",
                    textAlign: "center"
                  }}
                >
                  {item.label}
                </div>
              }
              inputProps={{
                className: "form-control textBox",
                id: "school",
                style: { width: "100%" },
                placeholder: "School"
              }}
              wrapperStyle={{ display: "inline-block", width: "100%"}}
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onMenuVisibilityChange={isOpen => {
                if(isOpen && this.state.value === "N/A") {
                  this.setState({ value: "" });
                }
                else if(!isOpen && this.state.value === "") {
                  this.setState({ value: "N/A" });
                }
              }}
              onSelect={value => this.setState({ value })}
            />
          </MDBContainer>
          <label className="width-90 fontSizeSmall" for="email">
            Email address:
          </label>
          <MDBContainer className="form-group">
            <input
              type="email"
              className="form-control textBox"
              id="email"
              placeholder="Email"
            />
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
  
}