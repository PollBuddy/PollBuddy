import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { ErrorText } from "../../components";
import { useFn, useTitle } from "../../hooks";
import { useNavigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function GroupCreation() {
  const navigate = useNavigate();
  useTitle("Group Creation");

  const [ name, setName ] = React.useState("");
  const [ desc, setDesc ] = React.useState("");
  const [ error, setError ]  = React.useState(false);

  const handleName = useFn(setName, e => e.target.value);
  const handleDesc = useFn(setDesc, e => e.target.value);

  const handleSubmit = React.useCallback(async () => {
    setError(false);
    const response = await fetch(BACKEND + "/groups/new", {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, description: desc })
    });
    
    const { result, data } = await response.json();

    if (result === "success") {
      navigate("/groups/" + data.id);
    } else {
      setError(true);
    }
  }, [ setError, navigate, name, desc ]);

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <MDBContainer className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input name="name" id="groupName" className="form-control textBox"
            onInput={handleName}/>

          <label htmlFor="groupName">Group Description:</label>
          <input name="description" id="groupDescription"
            className="form-control textBox" onInput={handleDesc}/>
        </MDBContainer>
        { error && <ErrorText/> }
        <button className="button" onClick={handleSubmit}>Create Group</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(GroupCreation);