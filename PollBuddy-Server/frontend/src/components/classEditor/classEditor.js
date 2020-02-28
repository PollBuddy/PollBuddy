import React, { Component } from 'react';
import './classEditor.scss'
import {MDBContainer} from "mdbreact";

export default class ClassEditor extends Component {
    constructor(props){
        super(props);
        //holds a variable for each piece of information that the backend
        //has
        this.state = {
            name: '',
            polls: [],
            users: [],
            instructors: []
        }
    }

    componentWillMount() {//this function is called before the components are mounted
        fetch('http://localhost:3001/api/groups/').then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
            return res.json();
        }).then(myJson => {
            //get the info for the specific id in props from the json
            fetch('http://localhost:3001/api/groups/' + this.props.id + '/').then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
                return res.json();
            }).then(myJson => {
                //this workaround should be refactored later
                let obj = myJson[0];
                //set the state with the proper information
                this.setState(
                    {
                        name: obj.name,
                        polls: obj.polls,
                        users: obj.users,
                        instructors: obj.instructors
                    }
                )
            })
        });
    }


    render() {
        console.log("polls: " + this.state.polls);
        console.log("users: " + this.state.users);
        console.log("instructors: " + this.state.instructors);
        if(this.props.id === -1){
            return <MDBContainer/>
        }
        return <MDBContainer>
            <p>{this.state.name}</p>
        </MDBContainer>
    }
}