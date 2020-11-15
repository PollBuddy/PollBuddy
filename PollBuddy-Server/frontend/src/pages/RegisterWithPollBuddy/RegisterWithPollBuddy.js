import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import "./RegisterWithPollBuddy.scss";
import {withRouter} from "react-router-dom";

class RegisterWithPollBuddy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      userValid: true,
      emailValid: true,
      emailExists: false,
      passValid: true,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Register with Poll Buddy");
  }

  handleRegister() {
    // do input validation
    const userValid = new RegExp(/^[a-zA-Z0-9_.-]{3,32}$/).test(this.state.username);
    const emailValid = new RegExp(/^[a-zA-Z0-9_.]+@\w+\.\w+$/).test(this.state.email);
    const passValid = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
      .test(this.state.password);

    // update component's state
    this.setState({userValid: userValid});
    this.setState({emailValid: emailValid});
    this.setState({passValid: passValid});
    this.setState({emailExists: false});

    if (!userValid || !emailValid || !passValid) {
      return;
    }

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
    })
      .then(response => response.text())
      .then(response => {
        // email already exists in database, don't login
        if (response === "Exists") {
          this.setState({emailExists: true});
        } else {
          localStorage.setItem("loggedIn", true);
          // redirect to groups page
          this.props.history.push("/groups");
        }
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
            <label htmlFor="firstnameText">Name:</label>
            <label htmlFor="lastnameText">Name:</label>
            <input placeholder="SIS" className="form-control textBox" id="firstnameText"/>
            <input placeholder="Man" className="form-control textBox" id="lastnameText"/>
              onChange={(evt) => { this.setState({username: evt.target.value}); }}/>
            {!this.state.userValid && 
              <ul className="error">
                <li>Username must be between 3 and 32 characters</li>
                <li>Valid characters: (A-Z), (0-9), (-,_,.)</li>
              </ul>
            }
            <label htmlFor="emailText">Email:</label>
            <input placeholder="mans@rpi.edu" className="form-control textBox" id="emailText"
              onChange={(evt) => { this.setState({email: evt.target.value}); }}/>
            {!this.state.emailValid && 
              <ul className="error">
                <li>Invalid email format!</li>
              </ul>
            }
            {this.state.emailExists && <div className="error">A user with this email already exists!</div>}
            <label htmlFor="passwordText">Password:</label>
            <input type="password" placeholder="••••••••••••" className="form-control textBox" id="passwordText"
              onChange= {(evt) => { this.setState({password: evt.target.value}); }}/>
            {!this.state.passValid && 
              <ul className="error">
                <li>Invalid password. Must contain:</li>
                <li>6 or more characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
              </ul>
            }
          </MDBContainer>
          <button className="btn button" onClick={this.handleRegister}>Submit</button>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(RegisterWithPollBuddy);
