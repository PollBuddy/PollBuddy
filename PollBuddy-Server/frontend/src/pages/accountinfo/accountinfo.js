import React, { Component } from "react";
import "./accountinfo.scss"
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";

export default class accountinfo extends Component {
  componentDidMount(){
    this.props.updateTitle("Account Info");
  }

  render() {
    return (
      <MDBContainer>
        <div className="main-body">
          <form>
            <label>
						Name
              <input type="text" name="name" placeholder="John Doe" />
            </label>
            <label>
						Email
              <input type="text" name="email" placeholder="name@gmail.com" />
            </label>
            <label>
						Current Password
              <input type="password" name="current" placeholder="Current Password" />
            </label>
            <label>
						New Password
              <input type="password" name="new" placeholder="New Password" />
            </label>
            <label>
						Confirm Password
              <input type="password" name="confirm" placeholder= "Confirm Password" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </MDBContainer>
    )
  }
}
