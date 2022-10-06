import React from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import privacyMdPath from "./Privacy.md";
import { useTitle, useAsyncEffect } from '../../hooks';

/*----------------------------------------------------------------------------*/

function Privacy() {
  useTitle("Fequently Asked Questions");
  const [ terms, setTerms ] = React.useState(null);

  useAsyncEffect(async () => {
    const response = await fetch(privacyMdPath);
    const text = await response.text();
    setTerms(text);
  }, [ setTerms ]);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer className="box box-body-text">
        <h1>Our Privacy Policy</h1>
        {/* Render page from markdown file using react-markdown */}
        <ReactMarkdown children={terms}/>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default React.memo(Privacy);