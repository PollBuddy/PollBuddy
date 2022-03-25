import React, {Component} from "react";
import {Link, Navigate} from "react-router-dom";
import { MDBContainer } from "mdbreact";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import "../../styles/main.scss";
import "./Groups.scss";

class Groups extends Component {

  constructor(props){
    super(props);
    this.state = {
      //TODO: fetch this data from api/users/:id/groups when that functionality works
      error: null,
      redirect: false,
      doneLoading: false,
      adminGroups: [],
      memberGroups: [],
      openJoinGroupPopup: false,
      groupCode: "",
      leaveGroupButtonText: "Leave Group",
      showXs: false,
      isOpen: false
    };

    if(!localStorage.getItem("loggedIn")){
      //Redirect("/login");//this is a way to redirect the user to the page
      //window.location.reload(false);//this forces a reload so this will make the user go to the login page. A little barbaric but it works. If frontend wants to make it better by all means
    }
  }

  stopLoading = () => {
    this.setState({
      doneLoading: true
    });
  };

  signout(){
    //localStorage.removeItem("loggedIn");//todo if admin -- more specifically make diff states if the user who logged in is an admin... or teacher. wouldn't want teacher accessing user things or vice versa...
    //Redirect("/login");
  }
  componentDidMount() {
    this.props.updateTitle("My Groups");
    fetch(process.env.REACT_APP_BACKEND_URL + "/users/me/groups").then((res) => res.json()).then((json) => {
      console.log(json);
      this.setState({ adminGroups: json["data"]["admin"] });
      this.setState({ memberGroups: json["data"]["member"] });
    }).catch(() => {
      console.log("Error, redirecting");
      this.setState({ redirect: true });
    });
  }
  toggleLeaveGroup = () => {
    this.setState(prevState => ({ showXs: !prevState.showXs }));
    if (this.state.leaveGroupButtonText === "Leave Group") {
      this.setState({ leaveGroupButtonText: "Exit Leave Group" });
    } else {
      this.setState({ leaveGroupButtonText: "Leave Group" });
    }
  };

  handleClick = () => {
    // call prompt() with custom message to get user input from alert-like dialog
    const groupCode = prompt("Please enter your group code");
    // combine the group code into URL and redirect to the next page
    this.props.router.navigate("/groups/" + groupCode + "/polls");
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.router.navigate("/groups/" + this.state.groupCode + "/polls");
  };
  handleChange = (e) => {
    this.setState({groupCode: e.target.value});
  };

  render() {
    const { showXs } = this.state;
    if(this.state.redirect) {
      return <Navigate to='/login'  />;
    }
    if(this.state.error != null){
      return (
        <MDBContainer fluid className="page">
          <MDBContainer fluid className="box">
            <p className="fontSizeLarge">
              Error! Please try again.
            </p>
          </MDBContainer>
        </MDBContainer>
      );
    } else if(!this.state.doneLoading){
      return (
        <MDBContainer className="page">
          <LoadingWheel/>
          <button className="button" onClick={this.stopLoading}>End Loading</button>
        </MDBContainer>
      );
    } else {
      return (
        <MDBContainer className="page">
          <MDBContainer className="box">
            <p className="fontSizeLarge">
              As a Group Admin:
            </p>
            {this.state.adminGroups.length === 0 ? (
              <p>Sorry, you are not the admin of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.adminGroups.map((e) => (
                  <Link to={"/groups/" + e.id + "/polls"}>
                    <button style={{  width: "20em" }} className="button">{e.name}</button>
                  </Link>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              As a Group Member:
            </p>
            {this.state.memberGroups.length === 0 ? (
              <p>Sorry, you are not the member of any groups.<br/> <br/></p>
            ) : (
              <React.Fragment>
                {this.state.memberGroups.map((e) => (
                  <div>
                    <Link to={"/groups/" + e.id + "/polls"}>
                      <button style={{  width: "20em" }} className="button">{e.name}</button>
                    </Link>
                    {showXs && <LeaveGroupIcon openDialog={() => this.setState({ isOpen: true })} />}
                  </div>
                ))}
              </React.Fragment>
            )}

            <p className="fontSizeLarge">
              Group Management:
            </p>
            <Link to={"/groups/new"}>
              <button className="button">Create New Group</button>
            </Link>
            <Link to={"/groups/join"}>
              <button className="btn button">Join Group</button>
            </Link>
            {/* <Popup isOpen={this.state.openJoinGroupPopup} onClose={(e) => this.setState({ openJoinGroupPopup: false })}>
              <form onSubmit={this.handleSubmit}>
                <label>Please enter your group code:</label>
                <input className="form-control textBox" type="text" name="groupCode" onChange={this.handleChange}/>
                <input className="btn button float-right" type="submit" value="OK"/>
              </form>
            </Popup> */}
            <button className={"button " + (this.state.leaveGroupButtonText === "Exit Leave Group" ? "groups_exit_leave_group" : "")}
              onClick={this.toggleLeaveGroup}>{this.state.leaveGroupButtonText}</button>
            {this.state.isOpen && <Dialog onClose={() => this.setState({isOpen: false})} />}
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}

function LeaveGroupIcon(props) {
  return (
    <span className="groups_removable" onClick={props.openDialog}>X</span>
  );
}

function Dialog(props) {
  return (
    <div className="groups_leave_groups_dialog">
      <button onClick={props.onClose} className="button">X</button>
      <p>Are you sure you want to leave this group?</p>
      <button onClick={props.onClose} className="button groups_leave_group_button">Yes</button>
    </div>
  );
}
export default withRouter(Groups);