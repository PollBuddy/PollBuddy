import React, { Component } from 'react';
import './classEditor.scss'
import {MDBContainer} from "mdbreact";

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

    onInput = e => {
        //update state to include the data that was changed from the form
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = e =>{
        console.log(e);
        console.log(this.state.name);
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
    
    render() {
        if(this.state === null){
            //show nothing (or loading wheel) if the data has not come in yet
            return null;//loading todo ui
        }else{
            return (
                    <MDBContainer fluid className="editor-box">
                        <label className="field-label">Class Name:</label>
                        <div className="form-group">
                            <input type="text" name="name" id="className" className="form-control" value={this.state.name} onInput={this.onInput} />
                        </div>
                        <button className="submit-button" onClick={this.onSubmit}>Save Changes</button>
                    </MDBContainer>
            )
        }
    }
}
