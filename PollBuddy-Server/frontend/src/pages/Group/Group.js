import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.params.groupID,
      name: "",
      description: "",
      isMember: false,
      isAdmin: false,
      polls: [],
      doneLoading: false,
      showError: null
    };
  }

  componentDidMount() {
    this.props.updateTitle(this.state.name);
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result === "success") {
          this.props.updateTitle(response.data.name);
          if (response.data.isMember || response.data.isAdmin ) {
            this.setState({
              name: response.data.name,
              description: response.data.description,
              isMember: response.data.isMember,
              isAdmin: response.data.isAdmin,
              doneLoading: true
            });
          } else {
            this.setState({
              showError: true,
            });
          }
        } else {
          this.setState({
            showError: true,
          });
        }
      });

    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.id + "/polls", {
      method: "GET"
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.result === "success") {
          this.setState({
            polls: response.data,
          });
        }
      });
  }

  pollButtonClick = (pollID) => {
    if (this.state.isAdmin) {
      window.location.href = "/polls/" + pollID + "/edit";
    } else if(this.state.isMember) {
      window.location.href = "/polls/" + pollID + "/view";
    }
  };

  render() {
    if (this.state.showError) {
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
          <Link to={"/groups"}>
            <button className="backButton">Back</button>
          </Link>
          <MDBContainer className="two-box">
            <GroupSettings state={this.state}/>
            <MDBContainer className="box">
              <p className="fontSizeLarge">
                My Polls
              </p>
              {this.state.polls.length === 0 ? (
                <p>Sorry, you don't have any polls.<br/> <br/></p>
              ) : (
                <React.Fragment>
                  {this.state.polls.map((poll, index) => (
                    <button style={{width: "17em"}}
                      className="button"
                      onClick={() => this.pollButtonClick(poll.id)}
                    >{"Poll " + (index + 1) + ": " + poll.title}

                    </button>
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

export default withRouter(Group);
