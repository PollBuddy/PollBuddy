import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import PollCode from "../../components/PollCode/PollCode";

export default class Code extends Component {

  componentDidMount() {
    this.props.updateTitle("Enter Poll Code");
  }

  render() {
    return (
      <MDBContainer fluid className="page">
        <PollCode/>
      </MDBContainer>
    );
  }
}
