import React from "react";
import "mdbreact/dist/css/mdb.css";
import { withRouter } from "../../components/PropsWrapper/PropsWrapper";
import { MDBContainer } from "mdbreact";
import ErrorText from "../../components/ErrorText/ErrorText";
import { useFn, useTitle } from '../../hooks';

/*----------------------------------------------------------------------------*/

function GroupCreation({ updateTitle, router }) {
  useTitle(updateTitle, "Group Creation");

  const [ name, setName ] = React.useState("");
  const [ description, setDescription ] = React.useState("");
  const [ showError, setShowError ] = React.useState(false);

  const handleName = useFn(setName, e => e.target.value);
  const handleDescription = useFn(setDescription, e => e.target.value);

  const onSubmit = React.useCallback(async () => {
    setShowError(false);
    const URL = process.env.REACT_APP_BACKEND_URL + "/groups/new";
    const response = await fetch(URL, {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const { result, data } = await response.json();
    console.log({ result, data });

    if (result === "success") {
      router.navigate("/groups/" + data.id);
    } else {
      setShowError(true);
    }
  }, [ setShowError, router, name, description ]);

  return (
    <MDBContainer className="page">
      <MDBContainer className="box">
        <MDBContainer className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input
            name="name"
            id="groupName"
            className="form-control textBox"
            onInput={handleName}
          />
          <label htmlFor="groupName">Group Description:</label>
          <input
            name="description"
            id="groupDescription"
            className="form-control textBox"
            onInput={handleDescription}
          />
        </MDBContainer>
        {showError ? <ErrorText/> : null}
        <button className="button" onClick={onSubmit}>Create Group</button>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default withRouter(GroupCreation);