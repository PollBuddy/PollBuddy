import React, {Component} from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";

export default class PollCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "testcode",
      valid: false,
      errMsg: ""
    };

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.submitCode = this.submitCode.bind(this);
  }

  handleCodeChange(event) {
    // gets code string from input
    const code = event.target.value;
    this.setState({code: code});

    const validCodeRegex = RegExp(/^[a-zA-z0-9]{6}$/);
    this.setState({valid: validCodeRegex.test(code)});
  }

  submitCode() {
    // set error message if input is invalid
    this.setState({errMsg:
    !this.state.valid ? "Code must be 6 characters, A-Z, 0-9" : ""});
  }

  render() {
    return(
      <MDBContainer className="box">
        <MDBContainer className="form-group">
          <label htmlFor="pollCodeText">Already have a Poll Code? Enter it here:</label>
          <input placeholder="K30SW8" onChange={this.handleCodeChange} className="form-control textBox"/>
          <p style={{color: "red", textAlign: "center"}}>{this.state.errMsg}</p>
        </MDBContainer>
        <Link to={this.state.valid ? "/polls/" + this.state.code + "/view" : ""}>
          <button className = "btn button" onClick={this.submitCode}>
            Join Poll
          </button>
        </Link>
      </MDBContainer>
    );
  }
}