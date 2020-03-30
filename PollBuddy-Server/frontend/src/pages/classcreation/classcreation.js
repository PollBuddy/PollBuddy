import React, { Component } from 'react';
import './classcreation.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class classcreation extends Component {//this class will likely need to call groups/new and do more with that...
    constructor() {
        super();
        this.state = {
            name: ""
            , description: ""
        };
    }
    handleClick = () => {
        console.log(this.state);
        if (this.state.name !== ""){
            fetch('http://localhost:3001/api/groups/new/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },//HEADERS LIKE SO ARE NECESSARY for some reason https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
                body: JSON.stringify({
                    Name: this.state.name,
                })
            });/*note that this does not contain the trailing stuffs
            as template class does due to the backend route not returning
             anything for this endpoint... also no need for error checking
             because should always work... but probably should put in later maybe*/
        }
    }
    handleInput = e => {
        console.log(e.target.name);
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        return (
            <MDBContainer className="page-classcreation">

                <header className="Classcreation-header">
                    <h>
                        Create Your Classroom
            </h>
                </header>

                <MDBContainer className="d-flex p-2 Classcreation-Box">

                    <header Classcreation="ClasscreationElements">

                        <MDBContainer>
                            <MDBRow>
                                <MDBCol md="6">
                                    <form>
                                        <p className="h5 text-center mb-4">Enter Your Classroom Name Below</p>
                                        <MDBContainer className="white-text">
                                            <MDBInput
                                                label="Enter name"
                                                icon="envelope"
                                                group
                                                validate
                                                error="wrong"
                                                success="right"
                                                name="name"
                                                value={this.state.name}//simply following documentation at https://mdbootstrap.com/docs/react/forms/inputs/
                                                onInput={this.handleInput}
                                            />

                                            <p className="h5 text-center mb-4">Enter Your Classroom Description Below </p>
                                            <MDBInput
                                                label="Enter classroom description"//no functionality for classroom description in backend as of 1-02-2020
                                                icon="lock"
                                                group
                                                validate
                                                name="description"
                                                value={this.state.description}//simply following documentation at https://mdbootstrap.com/docs/react/forms/inputs/
                                                onInput={this.handleInput}
                                            />
                                        </MDBContainer>
                                        <MDBBtn size="sm" color="secondary" onClick={this.handleClick}>Create Classroom</MDBBtn>
                                    </form>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>

                    </header>

                </MDBContainer>

            </MDBContainer>
        )
    }
}
