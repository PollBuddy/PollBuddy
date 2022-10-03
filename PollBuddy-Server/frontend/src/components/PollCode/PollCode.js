import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";

/*----------------------------------------------------------------------------*/

function PollCode() {
  const [ code, setCode ] = React.useState("testcode");
  const [ valid, setValid ] = React.useState(false);
  const [ errMsg, setErrMsg ] = React.useState("");

  const handleCodeChange = React.useCallback(event => {
    // Gets code string from input.
    const newcode = event.target.value;
    setCode(newcode);

    const validCodeRegex = RegExp(/^[a-zA-z0-9]{6}$/);
    setValid(validCodeRegex.test(newcode));
  }, [ setCode, setValid ]);

  const submitCode = React.useCallback(() => {
    // Set error message if input is invalid.
    setErrMsg(valid ? "Code must be 6 characters, A-Z, 0-9" : "");
  }, [ valid, setErrMsg ]);

  return (
    <MDBContainer className="box">
      <MDBContainer className="form-group">
        <label htmlFor="pollCodeText">
          Already have a Poll Code? Enter it here:
        </label>
        <input placeholder="Ex: P8C0D3" onChange={handleCodeChange} 
          className="form-control textBox"/>
        <p style={{ color: "red", textAlign: "center" }}>
          {errMsg}
        </p>
      </MDBContainer>
      <Link to={valid ? `/polls/${code}/view` : ""}>
        <button className="button" onClick={submitCode}>
          Join Poll
        </button>
      </Link>
    </MDBContainer>
  );
}


/*----------------------------------------------------------------------------*/

export default PollCode;