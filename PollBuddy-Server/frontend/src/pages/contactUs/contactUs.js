import React, {Component} from "react";
import Autocomplete from "react-autocomplete";
import autosize from "autosize";
import {MDBContainer} from "mdbreact";
import PhoneInput from "react-phone-input-2";
import "mdbreact/dist/css/mdb.css";

export default class Contact extends Component {

  componentDidMount() {
    this.props.updateTitle("Contact Us");
    autosize(document.querySelector("textarea"));
  }

  constructor(props) {
    super(props);
    this.state = { formUp: false, phone: "", value: "N/A" };
  }

  render() {
    return(
      <MDBContainer fluid className="page">
        <p className="bold fontSizeLarge">
          Looking to get in touch with a developer? Shoot an email over to
          {" "}<em><a href="mailto:contactus@pollbuddy.app">
            contactus@pollbuddy.app
          </a></em>{" "}
          or click the button below to open a support ticket form.
        </p>
        <p className="width-90 fontSizeSmall">
          Alternatively, it would be greatly appeciated if you reported technical
          problems, such as bugs or design complaints/suggestions, by
          {" "}<em><a href="https://github.com/PollBuddy/PollBuddy/issues/new/choose">
            opening an issue
          </a></em>{" "}
          on our
          {" "}<em><a href="https://github.com/PollBuddy/PollBuddy">
            GitHub repository.
          </a></em>{" "}
        </p>
        <button
          className="btn button"
          style={{ display: this.state.formUp ? "none" : ""}}
          onClick={() => this.setState({ formUp: true })}
        >
          File Support Ticket
        </button>
        <MDBContainer fluid className="box"
          style={{ display: this.state.formUp ? "flex" : "none", margin: "50px auto" }}
        >
          <p className="bold fontSizeLarge">Support Ticket Information</p>
          <label htmlFor="name">
            <p className="fontSizeSmall">Full name:</p>
          </label>
          <MDBContainer className="form-group">
            <input required
              className="form-control textBox"
              id="name"
              placeholder="Name"
            />
          </MDBContainer>
          <label htmlFor="school">
            <p className="fontSizeSmall">School (if applicable):</p>
          </label>
          <MDBContainer className="form-group">
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
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
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
                placeholder: "School"
              }}
              menuStyle={{
                display: "inline-block",
                borderRadius: 5,
                position: "fixed",
                width: 100,
                maxHeight: "50%"
              }}
              wrapperStyle={{
                display: "inline-block",
                zIndex: 1,
                position: "relative"
              }}
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onMenuVisibilityChange={isOpen => {
                if(isOpen && this.state.value === "N/A") {
                  this.setState({ value: "" });
                } else if(!isOpen && this.state.value === "") {
                  this.setState({ value: "N/A" });
                }
              }}
              onSelect={value => this.setState({ value })}
            />
          </MDBContainer>
          <label htmlFor="email">
            <p className="fontSizeSmall">Email address:</p>
          </label>
          <MDBContainer className="form-group">
            <input required
              type="email"
              className="form-control textBox"
              id="email"
              placeholder="Email"
            />
          </MDBContainer>
          <label htmlFor="phone">
            <p class="fontSizeSmall">Phone number:</p>
          </label>
          <MDBContainer className="form-group">
            <PhoneInput
              inputProps={{ className: "form-control textBox", id: "phone" }}
              disableDropdown={true}
              country={"us"}
              value={this.state.phone}
              onChange={phone => this.setState({ phone })}
            />
          </MDBContainer>
          <label htmlFor="description">
            <p className="fontSizeSmall">Description of the issue:</p>
          </label>
          <MDBContainer className="form-group" style={{ width: "100%" }}>
            <textarea required
              className="form-control textBox"
              id="description"
              maxLength="500"
              style={{ width: "100%", minHeight: "70px" }}
              placeholder="500 character limit"
            ></textarea>
          </MDBContainer>
          <MDBContainer className="form-group">
            <button className="btn button" onClick={() => this.setState({ formUp: false })}>
              Send Ticket
            </button>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
  
}