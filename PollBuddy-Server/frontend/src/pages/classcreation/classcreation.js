import React, {Component} from 'react';
import './classcreation.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class classcreation extends Component {
  render() {    
    return (
     <MDBContainer className="page-classcreation">

        <header className="Classcreation-header">
            <h>
              Create Your Classroom
            </h>
        </header>

        <MDBContainer className="d-flex p-2 Classcreation-Box">

            <header Classcreation = "ClasscreationElements">

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
                                        type="email"
                                        validate
                                        error="wrong"
                                        success="right"
                                    />

                                    <p className="h5 text-center mb-4">Enter Your Classroom Description Below </p>
                                    <MDBInput
                                        label="Enter classroom description"
                                        icon="lock"
                                        group
                                        type="password"
                                        validate
                                    />
                                </MDBContainer>
                                <MDBBtn size = "sm" color = "secondary">Create Classroom</MDBBtn>
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
