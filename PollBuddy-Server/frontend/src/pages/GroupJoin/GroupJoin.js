import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";

class GroupJoin extends Component {
  constructor(props) {
    super(props);
    let groupCode = props.router.searchParams.get("code");
    this.state = {
      groupCode: groupCode || "",
      showConfirm: false,
      name: "",
      description: "",
      joinError: null,
    };
  }

  componentDidMount() {
    this.props.updateTitle("Join Group");
  }

  handleEnterCode = () => {
    this.setState({ joinError: null });
    fetch(process.env.REACT_APP_BACKEND_URL + "/groups/code/" + this.state.groupCode, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.result === "success") {
          this.setState({
            showConfirm: true,
            name: response.data.name,
            description: response.data.description,
            groupID: response.data.id,
          });
        } else {
          this.setState({ joinError: "Invalid group code. Did you type it in correctly?" })
        }
      });
  };

  handleChange = (e) => {
    this.setState({groupCode: e.target.value});
  };

  async handleConfirmationResponse(join) {
    if (join) {
      let response = await fetch(process.env.REACT_APP_BACKEND_URL + "/groups/" + this.state.groupCode + "/join", {
        method: "POST",
      });
      if (response.status === 200) {
        this.props.router.navigate("/groups/" + this.state.groupCode);
        return;
      }
    }
    this.props.router.navigate("/groups");
  }

  render() {
    return (
      <MDBContainer className="page">
        <MDBContainer fluid className="box">
          {this.state.showConfirm
            ?
            <MDBContainer className="form-group">
              <p className="fontSizeLarge">
                Group Name
              </p>
              <p className="fontSizeSmall">
                {this.state.name}
              </p>
              <p className="fontSizeLarge">
                Group Description
              </p>
              <p className="fontSizeSmall">
                {this.state.description}
              </p>
              <p>Are you sure you want to join this group?</p>
              <input onClick={this.handleConfirmationResponse.bind(this, false)} className="button float-left"
                type="submit" value="No"/>
              <input onClick={this.handleConfirmationResponse.bind(this, true)} className="button float-right"
                type="submit" value="Yes"/>
            </MDBContainer>
            :
            <MDBContainer className="form-group">
              <label>Please enter your group code:</label>
              <input className="form-control textBox" type="text" name="groupCode" value={this.state.groupCode}
                onChange={this.handleChange}/>
              {this.state.joinError &&
                <p style={{color: "red"}}>{ this.state.joinError.toString() }</p>
              }
              <input onClick={this.handleEnterCode} className="button float-right" type="submit" value="OK"/>
            </MDBContainer>
          }
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default withRouter(GroupJoin);
