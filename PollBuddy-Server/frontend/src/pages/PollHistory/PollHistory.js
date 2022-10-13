import React from "react";
import { Link } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import { useTitle } from "../../hooks";

// TODO: This page can only be access when one is logged in.
// TODO: Dynamically grab what polls the user has access to from the backend.
// TODO: Get which polls the users has admin access to and which they do not.

function PollHistory() {
  useTitle("My Poll Histories");

  // TODO, this state needs to be dynamically updated according to each user.
  const [ admin, ] = React.useState([ ]);
  const [ member, ] = React.useState([ ]);

  // These if else statement chooses what to display depending on if you are in
  // groups or not.
  let adminDisplay = <p>Looks like you have not created any groups!</p>;
  let memberDisplay = <p>Looks like you are not in any groups!</p>;

  const pollStyles = { width: "20em" };
  
  if (admin.length !== 0) {
    adminDisplay = admin.map(poll => (
      <div key={poll.id} className={poll.title}>
        <Link to={`/polls/${poll.id}/results`}>
          <button style={pollStyles} className="button">{poll.title}</button>
        </Link>
      </div>
    ));
  }

  if (member.length !== 0) {
    memberDisplay = member.map(poll => (
      <div key={poll.id} className={poll.title}>
        <Link to={`/polls/${poll.id}/results`}>
          <button style={pollStyles} className="button">{poll.title}</button>
        </Link>
      </div>
    ));
  }
  
  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <p className="fontSizeLarge">As a Group Admin:</p>
        {adminDisplay}
        <p className="fontSizeLarge">As a Group Member:</p>
        {memberDisplay}
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(PollHistory);