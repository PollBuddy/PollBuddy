import React, { Component } from 'react';
import './classEditor.scss'
import {MDBContainer} from "mdbreact";

export default class ClassEditor extends Component {
    constructor(props){
        super(props);

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
    
    render() {
        if(this.state === null){
            //show nothing (or loading wheel) if the data has not come in yet
            return null;//loading todo ui
        }else{
            return (
                    <MDBContainer fluid className="editor-box">
                        <label className="field-label">Class Name:</label>
                        <div className="form-group">
                            <input type="text" id="className" className="form-control" value={this.state.name} />
                        </div>
                        <button className="submit-button">Save Changes</button>
                    </MDBContainer>
            )
        }
    }
}
