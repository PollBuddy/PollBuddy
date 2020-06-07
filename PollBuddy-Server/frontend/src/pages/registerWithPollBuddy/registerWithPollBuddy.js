import React, { Component } from 'react';
import { MDBContainer } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class registerWithPollBuddy extends Component {
    componentDidMount(){
        this.props.updateTitle("Register with Poll Buddy");
    }
    render() {
        return (
    		<MDBContainer fluid className="page">
                <MDBContainer fluid className="box">
                    <p className="bold fontSizeLarge">
                        Register with Poll Buddy
                    </p>
                    <p className="width-90 fontSizeSmall">
                        To create an account, fill in the text boxes, then press submit.
                    </p>
                    <MDBContainer className="form-group">
                        <input placeholder="Enter your name" className="form-control textBox"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input placeholder="Enter your email" className="form-control textBox"/>
                    </MDBContainer>
                    <MDBContainer className="form-group">
                        <input placeholder="Enter your password" className="form-control textBox"/>
                    </MDBContainer>

                    <form>
                        <button className="btn button" formAction="/accountinfo" >Submit</button>
                    </form>
                </MDBContainer>
    		</MDBContainer>
    	)
	}
}
