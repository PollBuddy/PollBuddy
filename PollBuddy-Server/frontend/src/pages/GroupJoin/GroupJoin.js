import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";

export default class GroupJoin extends Component {//this class will likely need to call Groups/new and do more with that...
  constructor(props) {
    super(props);
    this.state = {
      groupCode: "",
      showConfirm: false
    };
  }
  
  componentDidMount(){
    this.props.updateTitle("Join Group");
  }

  handleEnterCode = () => {
    this.setState({showConfirm: true});
  };

  handleChange = (e) => {
    this.setState({groupCode: e.target.value});
  };

  handleConfirmationResponse(response) {
    if (response === true) {
      window.location.replace("/groups/" + this.state.groupCode + "/polls");
    } else {
      window.location.replace("/groups");
    }
  }

  render() {
    //TODO check if they're logged in
    return (
      <MDBContainer className="page">
        <MDBContainer fluid className="box">
          { this.state.showConfirm
            ?
            <MDBContainer className="form-group">
              <p>Are you sure you want to join this group?</p>
              <input onClick={this.handleConfirmationResponse.bind(this, false)} className="btn button float-left" type="submit" value="No"/>
              <input onClick={this.handleConfirmationResponse.bind(this, true)} className="btn button float-right" type="submit" value="Yes"/>
            </MDBContainer>
            :
            <MDBContainer className="form-group">
              <label>Please enter your group code:</label>
              <input className="form-control textBox" type="text" name="groupCode" onChange={this.handleChange}/>
              <input onClick={this.handleEnterCode} className="btn button float-right" type="submit" value="OK"/>
            </MDBContainer>
          }
        </MDBContainer>
      </MDBContainer>
    );
  }
}
