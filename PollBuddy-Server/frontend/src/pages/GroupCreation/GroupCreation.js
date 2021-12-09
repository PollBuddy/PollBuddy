import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import GroupEditor from "../../components/GroupEditor/GroupEditor";

export default class GroupCreation extends Component {//this class will likely need to call Groups/new and do more with that...
  componentDidMount(){
  this.props.updateTitle("Group Creation");
    this.props.updateTitle("My Groups");
    fetch("/me/groups").then((res) => res.json()).then((json) => {
      this.setState({ adminGroups: json["data"]["admin"] });
      this.setState({ memberGroups: json["data"]["member"] });
    }).catch(() => {
      this.setState({ redirect: true });
    });
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
