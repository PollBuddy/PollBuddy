import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { LoadingWheel, ErrorText } from "../../components";
import { useAsyncEffect, useFn, useTitle } from "../../hooks";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function AdminList({ admins }) {
  if (admins.length === 0) {
    return <p>Sorry, there are no admins in this group.</p>;
  } else {
    return admins.map((admin, index) =>
      <button style={{  width: "12em" }} className="button" key={index}>
        {admin.userName}
      </button>
    );
  }
}

function MemberList({ members }) {
  if (members.length === 0) {
    return <p>Sorry, there are no members in this group.</p>;
  } else {
    return members.map((member, index) =>
      <button style={{  width: "12em" }} className="button" key={index}>
        {member.userName}
      </button>
    );
  }
}

// This class will likely need to call Groups/new and do more with that...
function GroupEdit() {
  useTitle("Edit");
  const { groupID } = useParams();
  const navigate = useNavigate();

  const [ name, setName ] = React.useState("");
  const [ nameInput, setNameInput ] = React.useState("");
  const [ descInput, setDescInput ] = React.useState("");
  
  const [ loadingGroups, setLoadingGroups ] = React.useState(true);
  const [ loadingAdmins, setLoadingAdmins ] = React.useState(true);
  const [ admins, setAdmins ] = React.useState([ ]);
  const [ loadingUsers, setLoadingUsers ] = React.useState(true);
  const [ users, setUsers ] = React.useState([ ]);

  const [ error, setError ] = React.useState(false);

  // Load the group data.
  useAsyncEffect(async () => {
    const response = await fetch(`${BACKEND}/groups/${groupID}`);
    const { result, data } = await response.json();

    if (result === "success") {
      setName(data.name ?? "");
      setNameInput(data.name ?? "");
      setDescInput(data.description ?? "");
      setLoadingGroups(false);
    } else {
      navigate("/groups");
    }
  }, [ navigate, groupID, setName, setNameInput, setDescInput,
    setLoadingGroups ]);

  // Load the admin data.
  useAsyncEffect(async () => {
    const response = await fetch(`${BACKEND}/groups/${groupID}/admins`);
    const { result, data } = await response.json();
    if (result !== "success") { return; }

    setAdmins(data);
    setLoadingAdmins(false);
  }, [ groupID, setAdmins, setLoadingAdmins ]);

  // Load the user data.
  useAsyncEffect(async () => {
    const response = await fetch(`${BACKEND}/groups/${groupID}/members`);
    const { result, data } = await response.json();
    if (result !== "success") { return; }

    setUsers(data);
    setLoadingUsers(false);
  }, [ groupID, setUsers, setLoadingUsers ]);

  const handleName = useFn(setNameInput, e => e.target.value);
  const handleDesc = useFn(setDescInput, e => e.target.value);

  const onSubmit = React.useCallback(async () => {
    setLoadingGroups(true);

    const response = await fetch(BACKEND + "/groups/" + groupID + "/edit", {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput, description: descInput }),
    });
    
    const { result } = await response.json();
    setLoadingGroups(false);

    if (result === "success") {
      setError(false);
      setName(nameInput);
    } else {
      setError(true);
    }
  }, [ setLoadingGroups, nameInput, descInput, setError, setName, groupID ]);

  if (loadingGroups) {
    return (
      <MDBContainer fluid className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer fluid className="page">
      <MDBContainer className="two-box">
        <MDBContainer className="box">
          <MDBContainer className="form-group">
            <p className="fontSizeLarge">{name}</p>

            <p className="fontSizeMedium">Group Name:</p>
            <input name="nameInput" id="groupName"
              className="form-control textBox" value={nameInput}
              onInput={handleName}/>

            <p className="fontSizeMedium">Group Description:</p>
            <input name="descriptionInput" id="groupDescription"
              className="form-control textBox" value={descInput}
              onInput={handleDesc}/>
          </MDBContainer>
          { error && <ErrorText/> }
          <button className="button" onClick={onSubmit}>Save Changes</button>
        </MDBContainer>
        <MDBContainer className="box">
          <p className="fontSizeLarge">Admins</p>
          { loadingAdmins ? <LoadingWheel /> : <AdminList admins={admins}/> }
        </MDBContainer>
        <MDBContainer className="box">
          <p className="fontSizeLarge">Members</p>
          { loadingUsers ? <LoadingWheel /> : <MemberList members={users}/> }
        </MDBContainer>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(GroupEdit);