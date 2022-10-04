import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import { withRouter } from "../../components/PropsWrapper/PropsWrapper";
import { useTitle, useFn } from '../../hooks';

/*----------------------------------------------------------------------------*/

function GroupJoin({ updateTitle, router }) {
  useTitle(updateTitle, "Join Group");

  const originalCode = router.searchParams.get("code") || "";
  const [ groupCode, setGroupCode ] = React.useState(originalCode);
  const [ showConfirm, setShowCorfirm ] = React.useState(false);

  const handleEnterCode = useFn(setShowCorfirm, true);
  const handleChange = useFn(setGroupCode, e => e.target.value);
  const cancelJoin = useFn(router.navigate, "/groups");

  const handleJoin = React.useCallback(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/groups/${groupCode}/join`;
    const { status } = await fetch(URL, { method: "POST" });

    if (status === 200) {
      router.navigate("/groups/" + groupCode);
    } else {
      router.navigate("/groups");
    }
  }, [ router, groupCode ]);

  return (
    <MDBContainer className="page">
      <MDBContainer fluid className="box">
        { showConfirm ? (
          <MDBContainer className="form-group">
            <p>Are you sure you want to join this group?</p>
            <input onClick={cancelJoin} className="button float-left"
              type="submit" value="No"/>
            <input onClick={handleJoin} className="button float-right"
              type="submit" value="Yes"/>
          </MDBContainer>
        ) : (
          <MDBContainer className="form-group">
            <label>Please enter your group code:</label>
            <input
              className="form-control textBox" type="text" name="groupCode"
              value={groupCode} onChange={handleChange}/>
            <input
              onClick={handleEnterCode} className="button float-right"
              type="submit" value="OK"/>
          </MDBContainer>
        ) }
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default withRouter(GroupJoin);