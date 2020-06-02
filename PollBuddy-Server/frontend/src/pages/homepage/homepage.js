import React, {Component} from 'react';
import './homepage.scss'
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer } from 'mdbreact';
import { Link } from '@reach/router';
import logo from "../../images/logo.png";

export default class homepage extends Component {

    componentDidMount(){
        this.props.updateTitle("Home");
    }

    render() {
        return (
            <MDBContainer fluid className="page-homepage">
                <img src={logo} alt="logo" className="logo img-fluid" />

                <p className = "blurb"> An interactive questionnaire platform made by students, for
                    students, to strengthen lecture material and class attentiveness.</p>
                <MDBContainer>
                    <Link to={"/login"}>
                        <button className = "btn button">Login</button>
                    </Link>
                    <Link to={"/registerDefault"}>
                        <button className = "btn button">Register</button>
                    </Link>
                </MDBContainer>

                <p className = "blurb2" > Already have a Poll Code? Enter it here.</p>
                <MDBContainer className="form-group">
                    <input placeholder="Poll Code" className="enterCode"/>
                </MDBContainer>
                <Link to={"/pollviewer"}>
                    <button className = "btn poll-button">Join Poll</button>
                </Link>

            </MDBContainer>


        )
    }
}
