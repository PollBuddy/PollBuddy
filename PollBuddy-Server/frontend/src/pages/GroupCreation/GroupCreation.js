import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import GroupEditor from "../../components/GroupEditor/GroupEditor";

export default class GroupCreation extends Component {//this class will likely need to call Groups/new and do more with that...
  componentDidMount(){
    this.props.updateTitle("Group Creation");
  }

  constructor() {
    super();
    //TODO check if they're logged in
  }

  render() {
    //TODO check if they're logged in
    return (
      <MDBContainer className="page">
        {/*set new to true so we can use the creation version of the class editor component*/}
        <GroupEditor new={true}/>
      </MDBContainer>
    );
  }
}
