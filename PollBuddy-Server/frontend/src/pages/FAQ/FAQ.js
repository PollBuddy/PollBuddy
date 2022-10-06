import React from "react";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import ReactMarkdown from "react-markdown";
import faqFile from "./faq.md";
import { useAsyncEffect, useTitle } from "../../hooks";

/*----------------------------------------------------------------------------*/

function FAQ() {
  useTitle("Fequently Asked Questions");
  const [ questions, setQuestions ] = React.useState(null);

  useAsyncEffect(async () => {
    const response = await fetch(faqFile);
    const text = await response.text();
    setQuestions(text);
  }, [ setQuestions ]);

  return (
    <MDBContainer fluid className="page">
      <MDBContainer className="box box-body-text">
        <h1>Frequently Asked Questions</h1>
        <ReactMarkdown children={questions}/>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default React.memo(FAQ);