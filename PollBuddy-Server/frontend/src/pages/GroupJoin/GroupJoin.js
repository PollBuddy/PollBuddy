import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectTarget, useCompose, useFn, useTitle } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

function GroupJoin() {
  useTitle("Join Group");
  const navigate = useNavigate();
  const [ searchParams, ] = useSearchParams();
  const [ code, setCode ] = React.useState(searchParams.get("code") || "");
  const [ confirm, setConfirm ] = React.useState(false);

  const handleCode = useFn(setConfirm, true);
  const handleChange = useCompose(setCode, selectTarget);

  const noJoin = useFn(navigate, "groups");
  const yesJoin = React.useCallback(async () => {
    const URL = `${BACKEND}/groups/${code}/join`;
    const { ok } = await fetch(URL, { method: "POST" });

    navigate(`/groups/${ok ? code : ""}`);
  }, [ code, navigate ]);

  return (
    <MDBContainer className="page">
      <MDBContainer fluid className="box">
        { confirm ? (
          <MDBContainer className="form-group">
            <p>Are you sure you want to join this group?</p>
            <input onClick={noJoin} className="button float-left"
              type="submit" value="No"/>
            <input onClick={yesJoin} className="button float-right"
              type="submit" value="Yes"/>
          </MDBContainer>
        ) : (
          <MDBContainer className="form-group">
            <label>Please enter your group code:</label>
            <input className="form-control textBox" type="text"
              name="groupCode" value={code} onChange={handleChange}/>
            <input onClick={handleCode} className="button float-right"
              type="submit" value="OK"/>
          </MDBContainer>
        ) }
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(GroupJoin);