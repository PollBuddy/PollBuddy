import React, { Component } from 'react';
import './classEditor.scss'
import {MDBContainer} from "mdbreact";

export default class ClassEditor extends Component {
    constructor(props){
        super(props);
    }
    // init = () =>{//do this and componentDidUpdate instead of constructor idk why it works
    //     if(this.state===null||this.state.id!==this.props.id){//need to make sure that this only happens once or when desired. Otherwise will be infinite loop
    //         console.log("monkey time");
    //         console.log(this.props.id);
    //         fetch('http://localhost:3001/api/groups/').then(res => {//this is how one calls a get request (backend specifically made a method for finding all groups)
    //             return res.json();
    //         }).then(myJson => {
    //             //get the info for the specific id in props from the json
    //             fetch('http://localhost:3001/api/groups/' + this.props.id + '/').then(res => {//this is how one calls a get request (backend specifically made one for finding a specific group)
    //                 return res.json();
    //             }).then(myJson => {
    //                 //this workaround should be refactored later
    //                 let obj = myJson[0];
    //                 //set the state with the proper information
    //                 this.setState(
    //                     {
    //                         id: this.props.id,
    //                         name: obj.name,
    //                         polls: obj.polls,
    //                         users: obj.users,
    //                         instructors: obj.instructors,
    //                     }
    //                 )
    //             })
    //         });
    //     }
    // }
    // componentDidUpdate = () => this.init();
    
    render() {
        if(this.state === null){
            console.log("it is null");
            return null;//loading todo ui
        }else{
            console.log("id: " + this.state.id);
            console.log("name: " + this.state.name);
            console.log("polls: " + this.state.polls);
            console.log("users: " + this.state.users);
            console.log("instructors: " + this.state.instructors);
            return (
                <MDBContainer>
                    <p>{this.state.name}</p>
                </MDBContainer>
            )
        }
    }
}
