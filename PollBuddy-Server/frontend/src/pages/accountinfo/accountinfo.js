import React, { Component } from 'react';
import "./accountinfo.scss"
import 'mdbreact/dist/css/mdb.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

export default class accountinfo extends Component {
    render() {
      return (
        <MDBContainer>
          <header>
          <link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet"></link>
            <div className="top-bar">
              <div className="header-text">
                <img src="Poll-Buddy-Logo.png" alt="logo" className="logo img-fluid"></img>
                  Account Info
                {/* <img src="homeicon.png" alt="home" className="home img-fluid"></img> */}
              </div>              
            </div>
              <div className="main-body">
              <br></br>
              <br></br>
              <div>
              <form>
                <label>
                    Name: &nbsp;    
                    <br></br>
                    <input type="text" name="name" placeholder="John Doe"/>
                </label>
                <br></br> <br></br>
                <label>
                    Email: &nbsp;     
                    <br></br>      
                    <input type="text" name="email" placeholder="name@gmail.com"/>
                </label>
                <br></br> <br></br>
                <label>
                    Current Password: &nbsp;   
                    <br></br>          
                    <input type="password" name="current" placeholder="Current Password"/>
                </label>
                <br></br> <br></br>
                <label>
                    New Password: &nbsp;    
                    <br></br>       
                    <input type="password" name="new" placeholder="New Password"/>
                </label>
                <br></br> <br></br>
                <label>
                    Confirm Password: &nbsp;  
                    <br></br>          
                    <input type="password" name="confirm" placeholder= "Confirm Password"/>
                </label>
                <br></br> <br></br>
                <input type="submit" value="Submit"></input>
              </form>
                     
              </div>
            </div>
          </header>

        </MDBContainer>
      )
    }
}