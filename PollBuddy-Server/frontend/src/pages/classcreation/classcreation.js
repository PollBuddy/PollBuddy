import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import ClassEditor from "../../components/classEditor/classEditor";

export default class classcreation extends Component {//this class will likely need to call groups/new and do more with that...
  componentDidMount(){
    this.props.updateTitle("Class Creation");
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
        fetch("http://localhost:3001/api/groups/new/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
          body: JSON.stringify({
            Name: this.state.name,
          })
        });/*note that this does not contain the trailing stuffs
            as template class does due to the backend route not returning
             anything for this endpoint... also no need for error checking
             because should always work... but probably should put in later maybe*/
      }
    }
    handleInput = e => {
      console.log(e.target.name);
      this.setState({
        [e.target.name]: e.target.value
      })
    }
    render() {
      return (
        <MDBContainer>
          <MDBContainer className="page-classcreation">
            <MDBContainer>
              <MDBContainer className="page">
                {/*set new to true so we can use the creation version of the class editor component*/}
                <ClassEditor new={true}/>
              </MDBContainer>
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      )
    }
}
