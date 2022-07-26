import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import "./Group.scss"
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
      originalPolls: [],
      doneLoading: false,
      showError: null,
      selected: 'createTime'
    };

    this.sortOptions = [
      { label: "Create Time", value: "creatTime" },
      { label: "Open Time", value: "openTime"},
      { label: "Close Time", value: "closeTime"}
    ]
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
            originalPolls: response.data
          });
        }
      });
  }

  pollButtonClick = (pollID) => {
    if (this.state.isAdmin) {
      this.props.router.navigate("/polls/" + pollID + "/edit");
    } else if(this.state.isMember) {
      this.props.router.navigate("/polls/" + pollID + "/view");
    }
  };

  sortByCreateTime() {
    var oriPolls = this.state.originalPolls;
    this.setState( {polls: oriPolls} );
  }

  sortByOpenTime() {
    var sortedPolls = JSON.parse(JSON.stringify(this.state.polls)).sort((p1, p2) => new Date(p1.openTime).getTime() - new Date(p2.openTime).getTime());
    this.setState({polls: sortedPolls});
  }

  sortByCloseTime() {
    var sortedPolls = JSON.parse(JSON.stringify(this.state.polls)).sort((p1, p2) => new Date(p1.closeTime).getTime() - new Date(p2.closeTime).getTime());
    this.setState({polls: sortedPolls});
  }
  
  handleSelectionChange(e) {
    const select= e.target.value;
    this.setState({selected: select});
    if (select == "creatTime") {
      this.sortByCreateTime();
    }
    else if (select == "openTime") {
      this.sortByOpenTime();
    }
    else if (select == "closeTime") {
      this.sortByCloseTime();
    }
  }  

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
          <MDBContainer className="two-box">
            <GroupSettings state={this.state}/>
            <MDBContainer className="box">
              <div className="myPolls">
                <p className="fontSizeLarge">
                  My Polls
                </p>
                <div className="SortDropdown">
                  <label>
                    Sort by
                    <select value={this.state.selected} onChange={this.handleSelectionChange.bind(this)}>
                      {this.sortOptions.map((option) => (
                        <option value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {this.state.polls.length === 0 ? (
                <p style={{margin: "auto"}}>You don't have any polls available at this time.<br/> <br/></p>
              ) : (
                <React.Fragment>
                  {this.state.polls.map((poll, index) => (
                    <Link to={"/polls/" + poll.id + (this.state.isAdmin ? "/edit" : "/view")} style={{width: "17em"}}>
                      <button style={{  width: "20em" }} className="button">{"Poll " + (index + 1) + ": " + poll.title}</button>
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

export default withRouter(Group);
