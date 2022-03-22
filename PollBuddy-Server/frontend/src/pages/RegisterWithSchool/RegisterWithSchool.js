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
      //initialize schools & schoolLinkDict w/ SchoolPicker return or default?
      "schoolInfo": {}
    };   
  }

  render() {
    console.log("render fnction called")


    if(!this.state.doneLoading)
    {
      console.log("LoadingWheel")
      return(
        <MDBContainer className="page">

            <SchoolPicker
            //put this back bc binding this call to SchoolPicker as a variable didn't work
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
              onSelect={value => this.setState({ value })}
              onDoneLoading={(schoolInfo) => {
                  this.setState({"doneLoading": true, "schoolInfo": schoolInfo})
                  console.log("BBB");
                  console.log(this.state.schoolInfo);
                }
              }
            />

          <LoadingWheel/>
        </MDBContainer>
      );
    }

    else
    {
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
                //here too
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                  onSelect={value => this.setState({ value })}
                  schoolInfo = {this.state.schoolInfo}
                  
                />

            <form>
              <button className="btn button" formAction={ "/api/users/register/" + this.state.schoolInfo.schoolLinkDict[this.state.value] }>Submit</button>
            </form>

          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
