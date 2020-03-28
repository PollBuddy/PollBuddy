import React, { Component } from 'react';
import { Link } from '@reach/router';
import { MDBBtn, MDBIcon, MDBContainer } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import new_logo from '../../Poll_Buddy_Logo_v4.png';
import './template.scss'

export default class Template extends Component {//this class is an example of how to use get requests so frontend team can eventually connect to backend refer to class creation for post requests
    constructor() {
        super();
        this.state = {
            groups: []
        }
    }
    componentWillMount() {//this function is called before the components are mounted
        fetch('http://localhost:3001/api/groups/').then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
            return res.json();
        }).then(myJson => {
            console.log(myJson);
            for (let i = 0; i < myJson.length; i++) {
                fetch('http://localhost:3001/api/groups/' + myJson[i] + '/').then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
                    return res.json();
                }).then(myJson => {
                    let tempGroups = this.state.groups;
                    tempGroups[i] = myJson;
                    this.setState(prevState => ({
                                groups: tempGroups
                            }
                        )
                    )
                })
            }
        })
        this.stringifyGroups();
        console.log(this.state.groups);//this is working... this sends the data to the console. Instead needs to be dynamically shown in the render function....
        // console.log(this.state.text);
    }
    stringifyGroups(){//THIS IS NONFUNCTIONAL BUT THE IDEA IS TO HAVE IT BE ABLE TO BE READ ON AN COMPONENT OR SOMETHING...
        //really this all could have been one var but i did this to demonstrate if one were to do this properly
        let t = "";
        for (let i = 0; i < this.state.groups.length; i++) {
            t += "Name: " + this.state.groups[i].Name + "\n";
            t += "\t_id: " + this.state.groups[i]._id + "\n";
            if (this.state.groups[i].InstructorID !== undefined)
                for (let j = 0; j < this.state.groups[i].PollID.length; j++)//because pollID is an array of pollIDs. Refer to backend documentation
                    fetch('http://localhost:3001/api/users/' + this.state.groups[i].PollID[j] + '/').then(res => {
                        return res.json();
                    }).then(myJson => {
                        t += "\tInstructorName" + myJson.Name + "\n";
                    })
            if (this.state.groups[i].PollID !== undefined)//this is necessary due to some fields being uninitiated. Name and ID should be initiated for all else
                for (let j = 0; j < this.state.groups[i].PollID.length; j++)//because pollID is an array of pollIDs. Refer to backend documentation
                    fetch('http://localhost:3001/api/polls/' + this.state.groups[i].PollID[j] + '/').then(res => {
                        return res.json();
                    }).then(myJson => {
                        t += "\tPollName" + myJson.Name + "\n";
                    })
        }
        this.state.text = t;//or return t
    }
    /*backend users routes isn't completely finished i think so 
    cannot start working on a completely functional users page 
    so this is gonna be a mock page that just gets all classes and displays all their info*/
    render() {
        return (
            <MDBContainer className="page-my-classes">
                <img src={new_logo} className="top_left_logo" alt="logo" />
                <hr className="line_style"></hr>
                <header className="header">
                    <br></br> TEST:
        </header>

                <MDBContainer className="buttons">
                    {this.state.groups.map((value, index) => {
                        console.log(value);
                        return <MDBBtn>{value[0]._id}</MDBBtn>//todo maybe fix this so this workaround is unnecessary
                    })}
                </MDBContainer>

            </MDBContainer>
        )
    }
}