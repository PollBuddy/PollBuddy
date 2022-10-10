import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { LoadingWheel, SchoolPicker } from "../../components";
import { useFn, useTitle } from "../../hooks";

function RegisterWithSchool() {
  useTitle("Register with School");

  const [ school, setSchool ] = React.useState("");
  const [ loaded, setLoaded ] = React.useState(false);
  const [ error, setError ] = React.useState("");
  const [ schoolInfo, setSchoolInfo ] = React.useState({ });

  const onSubmit = React.useCallback(() => {
    const link = schoolInfo?.schoolLinkDict[school];
    if (link) {
      window.location.replace("/api/users/register/" + link);
    } else {
      setError("Invalid school");
    }
  }, [ school, schoolInfo ]);

  const onSchool = useFn(setSchool, e => e.target.value);

  const onDoneLoading = React.useCallback(info => {
    setLoaded(true);
    setSchoolInfo(info);
  }, [ setLoaded, setSchoolInfo ]);

  if (!loaded) {
    return (
      <MDBContainer className="page">
        <SchoolPicker value={school} onChange={onSchool} onSelect={setSchool}
          onDoneLoading={onDoneLoading}/>
        <LoadingWheel/>
      </MDBContainer>
    );
  }
  
  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="box">
        <p className="fontSizeLarge">Register with School</p>
        <p>To create an account, select your school name.</p>
        <p>School Name:</p>
        <SchoolPicker value={school} onChange={onSchool} onSelect={setSchool}
          onDoneLoading={onDoneLoading}/>
        <p>{error}</p>
        <button className="btn button" onClick={onSubmit}>Submit</button>
      </MDBContainer>
    </MDBContainer>
  );
}

export default React.memo(RegisterWithSchool);