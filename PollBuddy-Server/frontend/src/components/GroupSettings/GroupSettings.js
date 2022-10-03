import React from "react";
import { MDBContainer } from "mdbreact";
import { Link } from "react-router-dom";
import "./GroupSettings.scss";
import { withRouter } from "../PropsWrapper/PropsWrapper";

/*----------------------------------------------------------------------------*/

function GroupSettings({ router, state }) {
  const { isAdmin, isMember, id } = state;

  // const toggleTextBox = React.useCallback((elementId, selector, text) => {
  //   if(document.getElementById(elementId).style.display === "block") {
  //     document.getElementById(elementId).style.display = "none";
  //     document.querySelector(selector).textContent = text;
  //   } else {
  //     document.getElementById(elementId).style.display = "block";
  //     document.querySelector(selector).textContent = "Submit";
  //   }
  // }, [ ]);

  const createNewPoll = React.useCallback(() => {
    router.navigate("/polls/new?groupID=" + id);
  }, [ router, id ]);

  const handleLeaveGroup = React.useCallback(async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${id}/leave`, {
      method: "POST",
    });
    router.navigate("/groups");
  }, [ router, id ]);

  const handleDeleteGroup = React.useCallback(async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/groups/${id}/delete`, {
      method: "POST",
    });
    router.navigate("/groups");
  }, [ router, id ]);

  if (isMember) {
    return (
      <MDBContainer className="box">
        <p className="fontSizeLarge">
          Member Settings
        </p>
        <button onClick={handleLeaveGroup} className="button">
          Leave Group
        </button>
      </MDBContainer>
    );
  } else if (isAdmin) {
    return (
      <MDBContainer className="box">
        <p className="fontSizeLarge">
          Admin Settings
        </p>
        <button style={{ width: "17em" }}
          className="button"
          onClick={createNewPoll}>
          Create New Poll
        </button>
        <Link to={`/groups/${id}/edit`}>
          <button style={{ width: "17em" }} className="button">
            Edit Group
          </button>
        </Link>
        <button style={{ width: "17em" }} className="button"
          onClick={handleDeleteGroup}>
          Delete this Group
        </button>
      </MDBContainer>
    );
  }
}

/*----------------------------------------------------------------------------*/

export default withRouter(GroupSettings);