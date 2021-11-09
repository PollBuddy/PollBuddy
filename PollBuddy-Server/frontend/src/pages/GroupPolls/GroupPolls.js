import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";

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
      member_correct: 22,
      groupData: null,
      doneLoading: true,
      id: null,
      error: null
      //need to put in groupID from backend
      //need to get other shit like pollIDs and their respective information...
    };
  }

  componentDidMount() {
    this.props.updateTitle(this.state.class);

    /*
    //TODO: uncomment the code below when the /api/groups/:id/polls route works properly
    var pathname = window.location.pathname;
    this.state.id = pathname.match("groups/(.*)/polls")[1];
    console.log(this.state.id);

    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/polls", {
      method: "GET"
    })
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }

      })
      .then(response => {
        if (response === {}) {
          console.log("Error fetching data");
        } else {
          console.log("Fetching data succeeded");
          console.log(response);
          this.setState({"groupData": response, "doneLoading": true});
        }
      })
      .catch(error => this.setState({"error": error}));
    */
  }


  render() {
    if (this.state.error != null) {
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error loading data! Please try again.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if (!this.state.doneLoading) {
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="two-box">
            {/*TODO: put the GroupEditor component here*/}
            <GroupSettings state={this.state}/>
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
                      <button style={{width: "17em"}}
                        className="button">{"Poll " + e.pollId + ": " + e.label}
                      </button>
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
}
