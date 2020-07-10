import React, {Component} from "react";
import Autocomplete from "react-autocomplete";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class registerWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="bold fontSizeLarge">
            Register with School
          </p>
          <p className="width-90 fontSizeSmall">
            To create an account, enter your school name or login using RPI's CAS.
          </p>
          <p className="width-90 fontSizeSmall" id="schoolNameText">
            School Name:
          </p>
          <MDBContainer className="form-group">
            <Autocomplete
              getItemValue={(item) => item.label}
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
              /*
              renderInput={function(props) {
                return (<input
                  aria-labelledby="schoolNameText"
                  placeholder="Enter school name"
                  className="form-control textBox"
                  onClick={props.onClick(props.ref)}
                  onChange={props.onChange(props.ref)}
                />)
              }}
              */
              renderItem={(item, isHighlighted) =>
                <div key={item.key} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.label}
                </div>
              }
              value={""}
              onChange={(e, value) => value = e.target.value}
              // onChange={(e, value) => {console.log(value); console.log(e.target.value)}}
              // these are one and the same
              // onSelect={(val) => value = val}
            />
          </MDBContainer>

          <Link to={"/accountinfo"}>
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
    )
  }
}
