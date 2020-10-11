import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";

export default class RegisterWithPollBuddy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  handleRegister() {
    // do input validation
    const userReg = new RegExp('/^\w{3,32}$/');
    const emailReg = new RegExp('/^[a-zA-Z0-9_.]+@\w+\.\w+$/');
    const passReg = new RegExp('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/');

    fetch(process.env.REACT_APP_BACKEND_URL + "/users/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        FirstName: "", 
        LastName: "", 
        Username: this.state.username, 
        Email: this.state.email, 
        Password: this.state.password
      })
    }).then(response => response.json())
      .then(data => {
        console.log(data);
      });
  }

  render() {
    this.handleRegister = this.handleRegister.bind(this);

    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Register with Poll Buddy
          </p>
          <p>
            To create an account, fill in the text boxes, then press submit.
          </p>
          <MDBContainer className="form-group">
            <label htmlFor="nameText">Name:</label>
            <input placeholder="SIS Man" className="form-control textBox" id="nameText" 
              onChange={(evt) => { this.setState({username: evt.target.value}); }}/>
            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"
              onChange={(evt) => { this.setState({email: evt.target.value}); }}/>
            <label htmlFor="passwordText">Password:</label>
            <input placeholder="●●●●●●●●●●●●" className="form-control textBox" id="passwordText"
              onChange= {(evt) => { this.setState({password: evt.target.value}); }}/>
          </MDBContainer>

          <button className="btn button" onClick={this.handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}
