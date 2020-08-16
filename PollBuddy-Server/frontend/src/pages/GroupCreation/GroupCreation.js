import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import GroupEditor from "../GroupEditor/GroupEditor";

export default class GroupCreation extends Component {//this class will likely need to call Groups/new and do more with that...
  componentDidMount(){
    this.props.updateTitle("Group Creation");
  }

  constructor() {
    super();
    this.state = {
      name: ""
      , description: ""
    };
  }
    handleClick = () => {
      console.log(this.state);
      if (this.state.name !== ""){
        fetch(process.env.REACT_APP_BACKEND_URL + "/groups/new/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
          body: JSON.stringify({
            Name: this.state.name,
          })
        });/*note that this does not contain the trailing stuffs
            as Template class does due to the backend route not returning
             anything for this endpoint... also no need for error checking
             because should always work... but probably should put in later maybe*/
      }
    }
    handleInput = e => {
      console.log(e.target.name);
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    render() {
      return (
        <MDBContainer className="page">
          {/*set new to true so we can use the creation version of the class editor component*/}
          <GroupEditor new={true}/>
        </MDBContainer>
      );
    }
}
