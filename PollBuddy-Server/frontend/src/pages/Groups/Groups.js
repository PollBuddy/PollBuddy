import React from "react";
import { Link } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import "../../styles/main.scss";
import "./Groups.scss";
import { useAsyncEffect, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const buttonStyles = { width: "20em" };

function AdminGroups({ groups }) {
  if (groups.length === 0) {
    return <p>You are not the admin of any groups.<br/> <br/></p>;
  } else {
    return groups.map((group, index) => (
      <Link to={"/groups/" + group.id} key={index}>
        <button style={buttonStyles} className="button">{group.name}</button>
      </Link>
    ));
  }
}

function MemberGroups({ groups }) {
  if (groups.length === 0) {
    return <p>You are not a member of any groups.<br/> <br/></p>;
  } else {
    return groups.map((group, index) => (
      <div key={index}>
        <Link to={"/groups/" + group.id}>
          <button style={buttonStyles} className="button">{group.name}</button>
        </Link>
      </div>
    ));
  }
}

function Groups() {
  useTitle("My Groups");

  const [ adminGroups, setAdminGroups ] = React.useState([ ]);
  const [ memberGroups, setMemberGroups ] = React.useState([ ]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(null);

  useAsyncEffect(async () => {
    try {
      const response = await fetch(BACKEND + "/users/me/groups");
      const { data } = await response.json();
      setAdminGroups(data.admin);
      setMemberGroups(data.member);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err || true);
    }
  }, [ setAdminGroups, setMemberGroups, setLoading, setError ]);

  if (error) {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">
            Error! Please try again.
          </p>
        </MDBContainer>
      </MDBContainer>
    );
  } else if (loading) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  } else {
    return (
      <MDBContainer className="page">
        <MDBContainer className="box">
          <p className="fontSizeLarge">Groups</p>
  
          <p className="fontSizeLarge">As a Group Admin:</p>
          <AdminGroups groups={adminGroups}/>
  
          <p className="fontSizeLarge">As a Group Member:</p>
          <MemberGroups groups={memberGroups}/>
  
          <p className="fontSizeLarge">Group Management:</p>
          <Link to="/groups/new">
            <button style={buttonStyles} className="button">
              Create New Group
            </button>
          </Link>
          <Link to="/groups/join">
            <button style={buttonStyles} className="button">
              Join Group
            </button>
          </Link>
        </MDBContainer>
      </MDBContainer>
    );
  }
}

export default React.memo(Groups);