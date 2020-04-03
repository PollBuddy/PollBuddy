import React, { Component } from 'react';
import './classEditor.scss'
import {MDBBtn, MDBContainer, MDBInput} from "mdbreact";

//this component has 2 modes, edit and new. The new version allows the user to create a new class while the edit version
//allows the user to edit an existing class. Pass new=true into props if you want to use the new version of the component
//and pass new=false if you want to use the edit version
export default class ClassEditor extends Component {
    constructor(props){
        super(props);

        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //the id of the component is not stored in state because it will never change
        this.state = {
            name: "",
            polls: null,
            users: null,
            instructors: null
        }

        //if the component is in class creation mode, we don't need to read any data from the backend
        if(!this.props.new){
            //once the component is created, fetch the data from the given group from the backend
            fetch('http://localhost:3001/api/groups/').then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
                return res.json();
            }).then(myJson => {
                //get the info for the specific id in props from the json
                fetch('http://localhost:3001/api/groups/' + this.props.id + '/').then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
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

    onInput = e => {
        //update state to include the data that was changed from the form
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = e =>{
        //if the component is in creation mode, we want to create a new entry in the backend however if it is not, we
        //just want to access the correct class from the backend and edit it
        if(this.props.new){
            fetch('http://localhost:3001/api/groups/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
                body: JSON.stringify({
                    //edit the data to include the values inputted
                    Name: this.state.name,
                    //TODO: add functionality
                    InstructorID: this.state.instructors,
                    PollID: this.state.polls,
                    UserID: this.state.users,
                })
            });
        }else{
            //fetch groups/this.props.id so that we can target the correct data
            fetch('http://localhost:3001/api/groups/' + this.props.id + '/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
                body: JSON.stringify({
                    //edit the data to include the values inputted
                    Action: "Add",
                    Name: this.state.name,
                    //TODO: add functionality
                    InstructorID: this.state.instructors,
                    PollID: this.state.polls,
                    UserID: this.state.users,
                })
            });
        }
    }
    
    render() {
        if(this.state === null){
            //show nothing (or loading wheel) if the data has not come in yet
            return null;//loading todo ui
        }else{
            return (
                    <MDBContainer fluid className="editor-box">
                        <label className="field-label">Class Name:</label>
                        <MDBContainer className="form-group">
                            <input
                                type="text"
                                name="name"
                                id="className"
                                className="form-control"
                                value={this.props.new ? null: this.state.name}
                                onInput={this.onInput} />
                        </MDBContainer>
                        <button className="submit-button" onClick={this.onSubmit}>
                            {this.props.new ? "Create Class": "Save Changes"}
                        </button>
                    </MDBContainer>
            )
        }
    }
}
