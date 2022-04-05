import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import SchoolPicker from "../../components/SchoolPicker/SchoolPicker";

export default class RegisterWithSchool extends Component {
  componentDidMount() {
    this.props.updateTitle("Register with School");
  }

  constructor(props) {
    super(props);
    
    this.state = {
      value: "",
      doneLoading: false,
      "schoolInfo": {},
      errorText: ""
    };   

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    if(!(this.state.value in this.state.schoolInfo.schoolLinkDict)) {
      this.setState({errorText: "Invalid school"});
    } else {
      window.location.replace("/api/users/register/" + this.state.schoolInfo.schoolLinkDict[this.state.value]);
    }
  }

  render() {
    if(!this.state.doneLoading) {
      return(
        <MDBContainer className="page">

          <SchoolPicker
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
            onSelect={value => this.setState({ value })}
            onDoneLoading={(schoolInfo) => {
              this.setState({"doneLoading": true, "schoolInfo": schoolInfo});
            }
            }
          />

          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
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
              School Name:
            </p>

            <SchoolPicker
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onSelect={value => this.setState({ value })}
              schoolInfo = {this.state.schoolInfo}
            />

            <p> {this.state.errorText} </p>

            <button className="btn button" onClick={this.handleSubmit}>Submit</button>

          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
