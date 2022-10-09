import React from "react";
import { Link, useParams } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import { useAsyncEffect, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function PollList({ polls, isAdmin }) {
  if (polls.length === 0) {
    return <p>You don't have any polls available at this time.<br/> <br/></p>;
  } else {
    return polls.map(({ id, title }, index) => (
      <Link to={"/polls/" + id + (isAdmin ? "/edit" : "/view")}
        style={{ width: "17em" }} key={index}>

        <button style={{ width: "20em" }} className="button">
          {`Poll ${index + 1}: ${title}`}
        </button>
      </Link>
    ));
  }
}

function Group() {
  const [ name, setName ] = React.useState("");
  const [ isMember, setIsMember ] = React.useState(false);
  const [ isAdmin, setIsAdmin ] = React.useState(false);
  const [ polls, setPolls ] = React.useState([ ]);
  const [ loaded, setLoaded ] = React.useState(false);
  const [ error, setError ] = React.useState(false);

  const { groupID: ID } = useParams();
  useTitle(name);

  useAsyncEffect(async () => {
    const response = await fetch(`${BACKEND}/groups/${ID}`, { method: "GET" });
    const { result, data } = await response.json();

    if (result !== "success") {
      setError(true);
    } else if (!data.isMember && !data.isAdmin) {
      setError(true);
    } else {
      setName(data.name);
      setIsAdmin(data.isAdmin);
      setIsMember(data.isMember);
      setLoaded(true);
    }
  }, [ setError, setName, setIsAdmin, setIsMember, setLoaded, ID ]);
  
  useAsyncEffect(async () => {
    const URL = `${BACKEND}/groups/${ID}/polls`;
    const response = await fetch(URL, { method: "GET" });
    const { result, data } = await response.json();

    if (result === "success") {
      setPolls(data);
    }
  }, [ setPolls, ID ]);

  if (error) {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">Error loading data! Please try again.</p>
        </MDBContainer>
      </MDBContainer>
    );
  } else if (!loaded) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  } else if (!isMember && !isAdmin) {
    // TODO: Display join button to the user if they are not in group.
    return (
      <MDBContainer className="page">
        <p className="fontSizeLarge">{name}</p>
        <button className="button">Join</button>
      </MDBContainer>
    );
  } else {
    return (
      <MDBContainer className="page">
        <MDBContainer className="two-box">
          <GroupSettings isMember={isMember} isAdmin={isAdmin} id={ID}/>
          <MDBContainer className="box">
            <p className="fontSizeLarge">My Polls</p>
            <PollList polls={polls} isAdmin={isAdmin}/>
          </MDBContainer>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default React.memo(Group);
