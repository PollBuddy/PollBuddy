import React, { Component } from "react";
//import './classEditor.scss'
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../loadingWheel/loadingWheel.js"

//this component has 2 modes, edit and new. The new version allows the user to create a new class while the edit version
//allows the user to edit an existing class. Pass new=true into props if you want to use the new version of the component
//and pass new=false if you want to use the edit version
export default class ClassEditor extends Component {
  constructor(props){
    super(props);

    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getAPIURL = this.getAPIURL.bind(this);
    this.getAPIJSON = this.getAPIJSON.bind(this);

    //the id of the component is not stored in state because it will never change
    this.state = {
      name: "",
      polls: null,
      users: null,
      instructors: null,
      loadingon: true
    }

    //if the component is in class creation mode, we don't need to read any data from the backend
    if(!this.props.new){
      //once the component is created, fetch the data from the given group from the backend
      fetch(process.env.REACT_APP_BACKEND_URL + "/groups/").then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
        return res.json();
      }).then(myJson => {
        //get the info for the specific id in props from the json
        fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.props.id + "/").then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
          return res.json();
        }).then(myJson => {
          //this workaround should be refactored later
          let obj = myJson[0];
          //call setState so the component updates once the data comes in
          this.setState(
            {
              name: obj.Name,
              polls: obj.polls,
              users: obj.users,
              instructors: obj.instructors,
            }
          )
        })
      });
    }

  }
    //these are variables passed in to props
    new;
    id;

    onChange = e => {
      this.setState({
        loadingon: false
	  })
	}

    onInput = e => {
      //update state to include the data that was changed from the form
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    onSubmit = e =>{
      //create new class or edit class based on the given mode and data in state
      fetch(this.getAPIURL(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
        body: JSON.stringify(this.getAPIJSON())
      });
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
        }
    }
    
    render() {
      if(this.state === null || this.state.loadingon == true){
        return (
          <MDBContainer>  
            <LoadingWheel/>
            <button className="btn button" onClick={this.onChange}>Stop Loading</button>
          </MDBContainer>
        )
      }else{
        return (
          <MDBContainer fluid className="box">
            <p className="bold fontSizeLarge">
                        Class Name:
            </p>

            <MDBContainer className="form-group">
              <input
                name="name"
                id="className"
                className="form-control textBox"
                value={this.props.new ? null: this.state.name}
                onInput={this.onInput} />
            </MDBContainer>

            <button className="btn button" onClick={this.onSubmit}>
              {this.props.new ? "Create Class": "Save Changes"}
            </button>
          </MDBContainer>
        )
      }
    }
}
