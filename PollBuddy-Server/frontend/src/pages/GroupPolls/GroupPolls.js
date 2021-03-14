import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import Settings from "../../components/Settings/Settings";

export default class GroupPolls extends Component {
  constructor(props) {//shouldn't this be dependent on the class???? thats why i included a constructor.
    super(props);
    //need to connect to backend probably here and then store data until it can be stored in state.
    //problem is there is no find in backend rn... frontend could do find but probably more resource intensive?
    //TODO: get all this from a backend call
    this.state = {
      isMember: false,
      class: "1200 - Data Structures",
      polls: [
        {pollId: 1, label: "Big O Notation"},
        {pollId: 2, label: "Basic C++ Syntax"},
        {pollId: 3, label: "Pointers"},
        {pollId: 4, label: "Vectors"},
        {pollId: 5, label: "Linked Lists"},
        {pollId: 6, label: "Sets"},
        {pollId: 7, label: "Maps"}
      ],
      total_questions: 24,
      avg_correct: 20,
      member_correct: 22
      //need to put in groupID from backend
      //need to get other shit like pollIDs and their respective information...
    };
  }

  componentDidMount() {
    this.props.updateTitle(this.state.class);
  }


  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="two-box">
          {/*TODO: put the GroupEditor component here*/}
          <Settings state={this.state}/>
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              My Polls
            </p>

            {this.state.polls.length === 0 ? (
              <p>Sorry, you don't have any polls.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.polls.map((e) => (
                  <Link to={"/polls/" + e.pollId + "/view"}>
                    <button style={{  width: "17em" }} className="button">{"Poll " + e.pollId + ": " + e.label}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
