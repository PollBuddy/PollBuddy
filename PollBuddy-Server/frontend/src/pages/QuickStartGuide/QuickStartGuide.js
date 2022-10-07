import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import ReactMarkdown from "react-markdown";
import quickStartGuide from "./QuickStartGuide.md";
import { useTitle, useAsyncEffect } from "../../hooks";

/*----------------------------------------------------------------------------*/

function QuickStartGuide() {
  useTitle("Quickstart Guide");
  const [ terms, setTerms ] = React.useState(null);

  useAsyncEffect(async () => {
    const response = await fetch(quickStartGuide);
    const text = await response.text();
    setTerms(text);
  }, [ setTerms ]);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer className="box box-body-text">
        {/* Render page from markdown file using react-markdown */}
        <ReactMarkdown children={terms} unwrapDisallowed/>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default React.memo(QuickStartGuide);