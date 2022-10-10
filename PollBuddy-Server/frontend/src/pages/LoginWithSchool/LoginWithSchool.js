import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { LoadingWheel, SchoolPicker } from "../../components";
import { useFn, useTitle } from "../../hooks";

function LoginWithSchool() {
  useTitle("Login With School");

  const [ school, setSchool ] = React.useState("");
  const [ loaded, setLoaded ] = React.useState(false);
  const [ schoolInfo, setSchoolInfo ] = React.useState({ });
  const [ error, setError ] = React.useState("");

  const onSubmit = React.useCallback(() => {
    const link = schoolInfo?.schoolLinkDict[school];
    if (link) {
      window.location.replace("/api/users/login/" + link);
    } else {
      setError("Invalid school");
    }
  }, [ school, schoolInfo, setError ]);

  const onSchool = useFn(setSchool, e => e.target.value);

  const onDoneLoading = React.useCallback(info => {
    setLoaded(true);
    setSchoolInfo(info);
  }, [ setLoaded, setSchoolInfo ]);

  if (!loaded) {
    return (
      <MDBContainer fluid className="page">
        {/* TODO: Hide this SchoolPicker; it's disgusting while loading. */}
        <SchoolPicker value={school} onChange={onSchool} onSelect={setSchool}
          onDoneLoading={onDoneLoading}/>
        <LoadingWheel/>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p className="bold fontSizeLarge">Login with School</p>
        <p className="fontSizeSmall">To login, select your school name.</p>
        <p className="fontSizeSmall" id="schoolNameText">School Name:</p>

        <SchoolPicker value={school} onChange={onSchool} onSelect={setSchool}
          onDoneLoading={onDoneLoading}/>
        
        <p>{error}</p>
        <button className="btn button" onClick={onSubmit}>Submit</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(LoginWithSchool);