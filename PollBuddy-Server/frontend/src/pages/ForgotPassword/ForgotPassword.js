import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { withRouter } from "../../components/PropsWrapper/PropsWrapper";
import { useTitle } from '../../hooks';

/*----------------------------------------------------------------------------*/

function ForgotPassword({ updateTitle, router }) {
  useTitle(updateTitle, "Forgot Password");

  const [ emailInput, setEmailInput ] = React.useState("");

  const requestReset = React.useCallback(async () => {
    const URL = process.env.REACT_APP_BACKEND_URL +
                "/users/forgotpassword/submit";
            
    const response = await fetch(URL, {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "email" : emailInput })
    });

    try {
      const val = await response.json();

      if (val.result !== "success") {
        console.log("failed to update data");
      } else {
        router.navigate("/login/reset");
      }
    } catch (err) {
      console.log(err);
    }
  }, [ emailInput, router ]);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email and we will send you a reset.</p>
        <MDBContainer className="form-group">
          <label htmlFor="emailText">Email:</label>
          <input placeholder="Enter email"
            className="form-control textBox"
            id="emailText"
            onChange={e => setEmailInput(e.target.value)}/>
        </MDBContainer>
        <button className="button" onClick={requestReset}>
          Reset Password
        </button>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default withRouter(ForgotPassword);