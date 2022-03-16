import React, { Component } from "react";
// import './GroupEditor.scss'
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Redirect from "react-router-dom/es/Redirect";
import ErrorText from "../ErrorText/ErrorText";

//this component has 2 modes, edit and new. The new version allows the user to create a new class while the edit version
//allows the user to edit an existing class. Pass new=true into props if you want to use the new version of the component
//and pass new=false if you want to use the edit version
export default class GroupEditor extends Component {
  constructor(props){
    super(props);
    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getAPIURL = this.getAPIURL.bind(this);
    this.getAPIJSON = this.getAPIJSON.bind(this);
    this.getInitialData = this.getInitialData.bind(this);
    this.checkError = this.checkError.bind(this);

    this.state = {
      id: this.props.id,
      name: "",
      polls: null,
      users: null,
      instructors: null,
      loadingon: true,
    };

    //we only need to read data from the backend if the component is in edit mode
    if(!this.props.new) {
      this.getInitialData();
    }else{
      //if the component is in create mode, don't show the loading indicator since we don't have to fetch anything from
      //the backend
      this.state["loadingon"] = false;
    }
  }

  async getInitialData(){
    //once the component is created, fetch the data from the given group from the backend
    //get the info for the specific id in props from the json
    let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.props.id + "/");
    let json = await response.json();
    //this workaround should be refactored later
    let obj = json[0];
    //call setState so the component updates once the data comes in
    this.setState(
      {
        name: obj.Name,
        polls: obj.polls,
        users: obj.users,
        instructors: obj.instructors,
        loadingon: false,
        redirectToGroup: false,
        showError: false,
      }
    );
  }

  //these are variables passed in to props
  new;
  id;

  onInput = e => {
    //update state to include the data that was changed from the form
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  async onSubmit() {
    //hide the error message if it was showing
    this.setState({showError: false});
    //create new group or edit group based on the given mode and data in state
    let response = await fetch(this.getAPIURL(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      body: JSON.stringify(this.getAPIJSON())
    });
    if(response.status === 200){
      if(this.props.new){
        //if the component is in new mode, redirect the user to the group's page
        //TODO get id from backend and add it to props
        this.setState({redirectToGroup: true, id: "temporary"});
      }
    }else{
      //let user know that something went wrong
      this.setState({showError: true});
    }
  }

  //get the correct api url based on whether we're in create mode or not
  getAPIURL(){
    return this.props.new ?
    //api/groups/new allows us to create a new entry
      process.env.REACT_APP_BACKEND_URL + "/groups/new" :
    //api/groups/groupID/edit allows us to edit an entry
      process.env.REACT_APP_BACKEND_URL + "/groups/" + this.props.id + "/edit";
  }

  //get the correct api json based on whether we're in create mode or not
  getAPIJSON(){
    return this.props.new ?
      {
        Name: this.state.name,
        //TODO: add functionality
        InstructorID: this.state.instructors,
        PollID: this.state.polls,
        UserID: this.state.users,
      } :
      {
        //edit the data to include the values inputted
        Action: "Add",
        Name: this.state.name,
        //TODO: add functionality
        InstructorID: this.state.instructors,
        PollID: this.state.polls,
        UserID: this.state.users,
      };
  }

  checkError() {
    return this.state.showError ? <ErrorText/> : null;
  }

  render() {
    //redirect to the page containing information about a group if one was just created
    if (this.state.redirectToGroup) {
      return <Redirect to={`/groups/${this.state.id}/polls`} push={true}/>;
    }
    if(this.state.loadingon === true){
      return (
        <MDBContainer>
          <LoadingWheel/>
        </MDBContainer>
      );
    }else{
      return (
        <MDBContainer fluid className="box">
          <MDBContainer className="form-group">
            <label htmlFor="groupName">Group Name:</label>
            <input
              name="name"
              id="groupName"
              className="form-control textBox"
              value={this.props.new ? null: this.state.name}
              onInput={this.onInput} />
          </MDBContainer>
          {this.checkError()}
          <button className="button" onClick={this.onSubmit}>
            {this.props.new ? "Create Group": "Save Changes"}
          </button>
        </MDBContainer>
      );
    }
  }
}
