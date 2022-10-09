import React from "react";
import { MDBContainer } from "mdbreact";
import { Link, useNavigate } from "react-router-dom";
import "./GroupSettings.scss";

function GroupSettings({ isMember, isAdmin, id }) {
  const navigate = useNavigate();

  const createPoll = React.useCallback(() => {
    navigate("/polls/new?groupID=" + id);
  }, [ navigate, id ]);

  const handleLeave = React.useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/groups/${id}/leave`;
    await fetch(URL, { method: "POST" });
    navigate("/groups");
  }, [ navigate, id ]);

  const handleDelete = React.useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/groups/${id}/delete`;
    await fetch(URL, { method: "POST" });
    navigate("/groups");
  }, [ navigate, id ]);

  const buttonStyles = { width: "17em" };

  if (isMember) {
    return (
      <MDBContainer className="box">
        <p className="fontSizeLarge">
          Member Settings
        </p>
        <button onClick={handleLeave} className="button">
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
        <button style={buttonStyles} className="button" onClick={createPoll}>
          Create New Poll
        </button>
        <Link to={"/groups/"+ id +"/edit"}>
          <button style={buttonStyles} className="button">
            Edit Group
          </button>
        </Link>
        <button style={buttonStyles} className="button" onClick={handleDelete}>
          Delete this Group
        </button>
      </MDBContainer>
    );
  }
}

export default React.memo(GroupSettings);