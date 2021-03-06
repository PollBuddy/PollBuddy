import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";

export default class GroupJoin extends Component {//this class will likely need to call Groups/new and do more with that...
  componentDidMount(){
    this.props.updateTitle("Group Join");
  }

  constructor() {
    super();
    //TODO check if they're logged in
  }

  render() {
    //TODO check if they're logged in
    return (
        <MDBContainer className="page">
            <MDBContainer fluid className="box">
                <MDBContainer className="form-group">
                    <label>Please enter your group code:</label>
                    <input className="form-control textBox" type="text" name="groupCode" onChange={this.handleChange}/>
                    <input className="btn button float-right" type="submit" value="OK"/>
                </MDBContainer>
                {/* <form className="form-group" onSubmit={this.handleSubmit}>
                    <label>Please enter your group code:</label>
                    <input className="form-control textBox" type="text" name="groupCode" onChange={this.handleChange}/>
                    <input className="btn button float-right" type="submit" value="OK"/>
                </form> */}
            </MDBContainer>
        </MDBContainer>
    );
  }
}