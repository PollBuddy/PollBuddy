import React, { Component } from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import GroupEditor from "../GroupEditor/GroupEditor";
import Question from "../../components/Question/Question";

export default class Template extends Component {//this class is an example of how to use get requests so frontend team can eventually connect to backend refer to class creation for post requests
  constructor() {
    super();
    this.state = {
      groups: []
    };
  }
  async componentDidMount(){
    this.props.updateTitle("Template");
    let groups = [];
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/Groups/");//this is alternative to .then's and all that
    const json = await response.json();
    for(let i = 0; i < json.length; i++){
      const r = await fetch(process.env.REACT_APP_BACKEND_URL + "/Groups/" + json[i] + "/");
      const rjson = await r.json();
      groups[i] = rjson[0];
    }
    this.setState({groups: groups});
  }
  getID(){//don't know exactly why arrow was borked but if you call by reference or without () then it will not return right
    let result = null;
    if(this.state.groups[0]!==undefined){//this is necessary. Checking the first index of Groups but could do a more rigorous check in future
      result = this.state.groups[0]._id;//Groups[0] is temporary
    }
    return result;
  }
  /*backend users routes isn't completely finished i think so
  cannot start working on a completely functional users page
  so this is gonna be a mock page that just gets all classes and displays all their info*/
  render() {
    return (
      <MDBContainer className="page">
        {/*<MDBContainer className="box">*/}
          <p className="fontSizeLarge">
            Test:
          </p>
          <Question questionObj={{
            "questionNumber": "1",
            "question": "What's 2 + 2",
            // "img": "https://i.kym-cdn.com/photos/images/newsfeed/001/409/553/5f5.png",
            "choices": [
              "A",
              "B",
              "C",
              "D"
            ],
            "choicesText": [
              "1",
              "2",
              "3",
              "4"
            ],
            "points": 2,
            "maxAllowedChoices": 1,
            "timeLimit": 10
          }}/>
          {/*<MDBContainer className="class-editor">*/}
          {/*  {*/}
          {/*    //display each class in the backend by mapping the groups to class editor components*/}
          {/*    this.state.groups.map(*/}
          {/*      (group, index) => {*/}
          {/*        console.log(group._id);*/}
          {/*        return <GroupEditor key={group._id} id={group._id} new={false}/>;//the key is needed because each child of a list must have a unique key*/}
          {/*      }*/}
          {/*    )*/}
          {/*  }*/}
          {/*</MDBContainer>*/}
        {/*</MDBContainer>*/}
      </MDBContainer>
    );
  }
}
