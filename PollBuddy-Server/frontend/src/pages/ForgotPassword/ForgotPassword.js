import React from "react";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { useTitle, useFn } from "../../hooks";
import { useNavigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function ForgotPassword() {
  useTitle("Forgot Password");

  const navigate = useNavigate();
  const [ email, setEmail ] = React.useState("");
  const handleEmail = useFn(setEmail, e => e.target.value);

  const onReset = React.useCallback(async () => {
    const response = await fetch(BACKEND + "/users/forgotpassword/submit", {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email : email }),
    });

    try {
      const { result } = await response.json();

      if (result === "success") {
        navigate("/login/reset");
      } else {
        console.log("failed to update data");
      }
    } catch (err) {
      console.log(err);
    }
  }, [ email, navigate ]);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email and we will send you a reset.</p>
        <MDBContainer className="form-group">
          <label htmlFor="emailText">Email:</label>
          <input placeholder="Enter email" className="form-control textBox"
            id="emailText" onChange={handleEmail}/>
        </MDBContainer>
        <button className="button" onClick={onReset}>Reset Password</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(ForgotPassword);
