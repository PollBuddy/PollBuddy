import React, { Component } from 'react';
import './classEditor.scss'
import {MDBContainer} from "mdbreact";

export default class ClassEditor extends Component {
    constructor(){
        super();
        //holds a variable for each piece of information that the backend
        //has
        this.state = {
            name: '',
            id: '',
            polls: [],
            users: [],
            instructors: []
        }
    }


    render() {
        return <MDBContainer>
            <h>test</h>
        </MDBContainer>
    }
}