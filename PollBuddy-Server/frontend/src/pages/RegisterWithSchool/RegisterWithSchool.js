import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import SchoolPicker, {schoolLinkDict} from "../../components/SchoolPicker/SchoolPicker";



class RegisterWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  check(value) {
    if(value in schoolLinkDict) {
      this.setState({
        errMsg: ""
      });

      return setTimeout(() => { 
        this.props.router.navigate("/api/users/register/" + schoolLinkDict[value], { replace: true });
        window.location.reload() }, 100);
    } else {
      this.setState({
        errMsg: value + " is not a valid school"
      });
    }
  }

  changeSchool(school) {
    this.setState({
      value: school
    });
  }

  constructor(props) {
    super(props);
    this.state = { 
      value: "",
      valid: false,
      errMsg: ""
    };
  }

  render() {
    this.check = this.check.bind(this);
    this.changeSchool = this.changeSchool.bind(this);
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with School
          </p>
          <p>
            To create an account, select your school name.
          </p>
          <p>
            { /* TODO: Add label here */}
            School Name:
          </p>

          <SchoolPicker
            value={this.state.value}
            onSelect={(school) => this.changeSchool(school)}
            onChange={(event, value) => this.setState({ value }) }
          />

          <p style={{color: "red", textAlign: "center"}}>{this.state.errMsg}</p>

          <button className="btn button" onClick={() => this.check(this.state.value)}>Submit</button>

        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(RegisterWithSchool);