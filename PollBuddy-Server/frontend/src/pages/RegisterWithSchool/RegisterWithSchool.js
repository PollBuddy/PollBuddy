import React, {Component} from "react";
import Autocomplete from "react-autocomplete";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class RegisterWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  constructor(props) {
    super(props);
    this.state = { value: "" };
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with School
          </p>
          <p>
            To create an account, enter your school name or login using RPI's CAS.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="school">School Name:</label>
            <Autocomplete
              items={[
                { key: 0, label: "Rensselaer Polytechnic Institute" },
                { key: 1, label: "Worcester Polytechnic Institute" },
                { key: 2, label: "Massachusetts Institute of Technology" },
                { key: 3, label: "Rochester Institute of Technology" },
                { key: 4, label: "University of Rochester" },
                { key: 5, label: "SUNY Polytechnic Institute" },
                { key: 6, label: "SUNY Albany" },
                { key: 7, label: "Albany Medical College" }
              ]}
              getItemValue={item => item.label}
              sortItems={(itemA, itemB, value) => {
                const lowA = itemA.label.toLowerCase();
                const lowB = itemB.label.toLowerCase();
                const indexA = lowA.indexOf(value.toLowerCase());
                const indexB = lowB.indexOf(value.toLowerCase());
                if(indexA !== indexB) {
                  return (indexA - indexB);
                }
                return (lowA < lowB ? -1 : 1);
              }}
              shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) >= 0}
              renderItem={(item) =>
                <div
                  key={item.key}
                  className="auto_comp"
                >
                  {item.label}
                </div>
              }
              inputProps={{
                className: "form-control textBox",
                placeholder: "Enter school name",
                id: "school",
              }}
              wrapperStyle={{ display: "block" }}
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onSelect={value => this.setState({ value })}
            />
          </MDBContainer>

          <Link to={"/account"}>
            <button className="btn button">Submit School Name</button>
          </Link>

          <form>
            <button className="btn button"
              formAction="https://cas-auth.rpi.edu/cas/login?service=http%3A%2F%2Fcms.union.rpi.edu%2Flogin%2Fcas%2F%3Fnext%3Dhttps%253A%252F%252Fwww.google.com%252F">
              CAS (I'm an RPI student)
            </button>
          </form>

        </MDBContainer>
      </MDBContainer>
    );
  }
}
