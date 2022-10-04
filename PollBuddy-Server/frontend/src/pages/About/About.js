import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";
import ReactMarkdown from "react-markdown";
import aboutMdPath from "./About.md";

/*----------------------------------------------------------------------------*/

function About({ updateTitle }) {
  const [ terms, setTerms ] = React.useState(null);

  React.useEffect(async () => {
    const response = await fetch(aboutMdPath);
    const text = await response.text();
    setTerms(text);
  }, [ setTerms ]);

  React.useEffect(() => {
    updateTitle?.("About");
  }, [ updateTitle ]);

  return (
    <MDBContainer className="page">
      <div className="box box-body-text">
        {/* Render page from markdown file using react-markdown. */}
        <ReactMarkdown children={terms} unwrapDisallowed />
      </div>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default About;