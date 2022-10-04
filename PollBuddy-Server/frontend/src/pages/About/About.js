import React from "react";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer } from "mdbreact";
import ReactMarkdown from "react-markdown";
import aboutMdPath from "./About.md";
import { useTitle } from '../../hooks';
import { useAsyncEffect } from '../../hooks';

/*----------------------------------------------------------------------------*/

function About({ updateTitle }) {
  useTitle(updateTitle, "About");
  
  const [ terms, setTerms ] = React.useState(null);

  useAsyncEffect(async () => {
    const response = await fetch(aboutMdPath);
    const text = await response.text();
    setTerms(text);
  }, [ setTerms ]);

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