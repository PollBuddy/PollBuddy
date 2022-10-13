import React from "react";
import { MDBContainer } from "mdbreact";
import "./ResetPassword.scss";
import "mdbreact/dist/css/mdb.css";
import { selectTarget, selectToggle, useCompose, useTitle } from "../../hooks";
import { useNavigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function ResetPassword() {
  useTitle("Reset Password");
  const navigate = useNavigate();

  const [ logOut, setLogOut ] = React.useState(true);
  const [ error, setError ] = React.useState("");
  const [ code, setCode ] = React.useState("");
  const [ user, setUser ] = React.useState("");
  const [ newPswd, setNewPswd ] = React.useState("");
  const [ confirmPswd, setCorfirmPswd ] = React.useState("");

  const handleLogOut = useCompose(setLogOut, selectToggle);

  const onReset = React.useCallback(async () => {
    setError("");

    if (newPswd !== confirmPswd || newPswd.length === 0) {
      return setError("New and confirmed passwords do not match.");
    }

    const response = await fetch(BACKEND + "/users/forgotpassword/change", {
      method: "POST",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resetPasswordToken: code,
        username: user,
        password: newPswd
      }),
    });

    try {
      const { result, error: err } = await response.json();
      if (result === "success") {
        navigate("/");
      }else{
        setError(err);
      }
    } catch (err) {
      setError(err);
    }
  }, [ code, confirmPswd, navigate, newPswd, user ]);

  const onCode = useCompose(setCode, selectTarget);
  const onUser = useCompose(setUser, selectTarget);
  const onPswd = useCompose(setNewPswd, selectTarget);
  const onConfirm = useCompose(setCorfirmPswd, selectTarget);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p>Enter the security code from your inbox and your new password.</p>
        <MDBContainer className="form-group">
          <label htmlFor="securityCodeText">Security code:</label>
          <input placeholder="A9EM3FL8W" className="form-control textBox"
            id="securityCodeText" onChange={onCode}/>
          
          <label htmlFor="userName" >UserName:</label>
          <input className="form-control textBox" id="userNameText"
            onChange={onUser}/>

          <label htmlFor="newPasswordText">New password:</label>
          <input placeholder="••••••••••••" className="form-control textBox"
            id="newPasswordText" onChange={onPswd} type="password"/>
          
          <label htmlFor="confirmPasswordText">Confirm password:</label>
          <input placeholder="••••••••••••" className="form-control textBox"
            id="confirmPasswordText" type="password" onChange={onConfirm}/>
          
          <div id="logOutEverywhereContainer">
            <label className="logOutLabel" htmlFor="logOutEverywhere">
              Log out everywhere
            </label>
            <input onChange={handleLogOut} className="logOutBox"
              type="checkbox" id="logOutEverywhere" checked={logOut}/>
          </div>

          <p style={{ color: "red" }}>{error}</p>
        </MDBContainer>
        <button className="button" onClick={onReset}>Submit</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(ResetPassword);