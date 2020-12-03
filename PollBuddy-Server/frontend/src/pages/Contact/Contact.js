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
        <MDBContainer className = "box">
          <p className="fontSizeLarge">
            Looking to get in touch with a developer? Shoot an email over to <a href="mailto:contact@pollbuddy.app">contact@pollbuddy.app</a> or click the button below to open a support ticket form.
          </p>
          <p>
            Alternatively, it would be greatly appreciated if you reported technical
            problems, such as bugs or design complaints/suggestions, by <a href="https://github.com/PollBuddy/PollBuddy/issues/new/choose">opening an issue</a> on our <a href="https://github.com/PollBuddy/PollBuddy">GitHub repository.</a>
          </p>
          <button
            className="btn button"
            style={{ display: this.state.formUp ? "none" : ""}}
            onClick={() => this.setState({ formUp: true })}
          >
            File Support Ticket
          </button>
        </MDBContainer>
        <MDBContainer fluid className="box"
          style={{ display: this.state.formUp ? "flex" : "none" }}
        >
          <p className="fontSizeLarge">Support Ticket Information</p>
          <MDBContainer className="form-group">
            <label htmlFor="name">Full name:</label>
            <input required
              className="form-control textBox"
              id="name"
              placeholder="Name"
            />
            <label htmlFor="school">School (if applicable):</label>
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
                  className="auto_comp"
                >
                  {item.label}
                </div>
              }
              inputProps={{
                className: "form-control textBox",
                id: "school",
                placeholder: "School"
              }}
              wrapperStyle={{
                display: "block",
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
            <label htmlFor="email">Email address:</label>
            <input required
              type="email"
              className="form-control textBox"
              id="email"
              placeholder="Email"
            />
            <label htmlFor="phone">Phone number:</label>
            <PhoneInput
              inputProps={{ className: "form-control textBox", id: "phone" }}
              disableDropdown={true}
              country={"us"}
              value={this.state.phone}
              onChange={phone => this.setState({ phone })}
            />
            <label htmlFor="description">Description of the issue:</label>
            <textarea required
              className="form-control textBox"
              id="description"
              maxLength="500"
              placeholder="500 character limit"
            ></textarea>
            <button className="btn button" onClick={() => this.setState({ formUp: false })}>
              Send Ticket
            </button>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }

}
