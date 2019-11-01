import React, {Component} from 'react';
import './login.scss'
import { MDBBtn } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import { MDBInput } from "mdbreact";

//purple color: f3e1ff
export default class login extends Component {
  render() {    
    return (
        <div className="page-login">

            <MDBBtn color = "secondary">About Us</MDBBtn>

          <header className="App-header">
            <h2>
              PollBuddy
            </h2>
          </header>

          <header Login = "LoginElements">

              <p>
                  Username:
              </p>

            <MDBInput label="Username" className="mt-4" />

            <p>
              Password:
            </p>

              <MDBInput label="Password" className="mt-4" />

              <MDBBtn color = "secondary">Login</MDBBtn>

              <MDBBtn color = "secondary">Forgot Your Password</MDBBtn>


            </header>

        </div>
    )
  }
}