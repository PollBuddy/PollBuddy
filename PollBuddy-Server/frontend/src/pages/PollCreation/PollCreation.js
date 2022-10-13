import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { ErrorText } from "../../components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectTarget, useCompose, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

// This class will likely need to call Groups/new and do more with that...
function PollCreation() {
  useTitle("Poll Creation");

  const [ params, ] = useSearchParams();
  const groupID = params.get("groupID");
  const navigate = useNavigate();
  const [ title, setTitle ] = React.useState("");
  const [ desc, setDesc ] = React.useState("");
  const [ error, setError ] = React.useState(null);

  const onSubmit = React.useCallback(async () => {
    setError(null);
    console.log({
      title: title,
      description: desc,
      group: groupID,
    });
    const response = await fetch(BACKEND + "/polls/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        description: desc,
        group: groupID,
      })
    });

    const data = await response.json();
    console.log(data);

    if (data.result === "success") {
      navigate(`/polls/${data.data.id}/edit`);
    } else {
      setError(data.error);
    }
  }, [ desc, groupID, navigate, title ]);

  let errorView;
  if (error == null) {
    errorView = null;
  } else if (error.title && error.description) {
    errorView = <ErrorText text="Must enter a title and description!"/>;
  } else if (error.title) {
    errorView = <ErrorText text="Must enter a title!"/>;
  } else if (error.description) {
    errorView = <ErrorText text="Must enter a description!"/>;
  } else {
    errorView = <ErrorText text="An unknown error has occurred."/>;
  }

  const handleTitle = useCompose(setTitle, selectTarget);
  const handleDesc = useCompose(setDesc, selectTarget);

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <MDBContainer className="form-group">
          <label htmlFor="pollTitle">Poll Title:</label>
          <input name="title" id="pollTitle" placeholder="Title"
            className="form-control textBox" onInput={handleTitle}/>
            
          <label htmlFor="pollDescription">Poll Description:</label>
          <input name="description" id="pollDescription" onInput={handleDesc}
            placeholder="Description" className="form-control textBox"/>
        </MDBContainer>
        {errorView}
        <button className="button" onClick={onSubmit}>Create Poll</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(PollCreation);
