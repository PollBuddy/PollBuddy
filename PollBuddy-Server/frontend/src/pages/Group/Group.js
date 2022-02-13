import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import GroupEditor from "../../components/GroupEditor/GroupEditor";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";

export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      description: "",
      isMember: false,
      isAdmin: false,
      polls: [],
      doneLoading: false,
      error: null
    };
  }

  componentDidMount() {
    this.props.updateTitle(this.state.name);
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.props.match.params.groupID, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result === "success") {
          this.props.updateTitle(response.data.name);
          if (response.data.isMember || response.data.isAdmin ) {
            this.setState({
              id: this.props.match.params.groupID,
              name: response.data.name,
              description: response.data.description,
              isMember: response.data.isMember,
              isAdmin: response.data.isAdmin,
              doneLoading: true
            });
            return;
          }
        }
        window.location.replace("/groups");
      });
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
    } else if (!this.state.isMember && !this.state.isAdmin) {
      //TODO: Display join button to the user if they are not in group
      return (
        <MDBContainer className="page">
          <p className="fontSizeLarge">
            { this.state.name }
          </p>
          <button className="button">
            Join
          </button>
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
