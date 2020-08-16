import React, {Component} from "react";
import {Link} from "react-router-dom";
import {MDBContainer} from "mdbreact";

export default class GroupPolls extends Component {
  constructor(props){//shouldn't this be dependent on the class???? thats why i included a constructor.
    super(props);
    //need to connect to backend probably here and then store data until it can be stored in state.
    //problem is there is no find in backend rn... frontend could do find but probably more resource intensive?
    this.state = {
      //need to put in groupID from backend
      //need to get other shit like pollIDs and their respective information...
    };
  }
  componentDidMount(){
    this.props.updateTitle("Polls");
  }
  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">
            Welcome to the polls page!
          </p>

          <Link to={"/polls/123/edit"}>
            <button className="btn button">Poll 123</button>
          </Link>
          <Link to={"/polls/420/edit"}>
            <button className="btn button">Poll 420</button>
          </Link>
          <Link to={"/polls/666/edit"}>
            <button className="btn button">Poll 666</button>
          </Link>

        </MDBContainer>
      </MDBContainer>
    );
  }
}