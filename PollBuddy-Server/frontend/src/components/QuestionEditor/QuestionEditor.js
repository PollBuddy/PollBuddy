import React from "react";
import { MDBContainer } from "mdbreact";
import "./QuestionEditor.scss";

function QuestionEditor() {
  return (
    <MDBContainer className="question-editor-container">
      <MDBContainer className="question-editor-field-group">
        <label>Question Title:</label>
        <input type="text"/>
      </MDBContainer>
      <MDBContainer className="question-editor-field-group">
        <label>Question Text:</label>
        <input type="text"/>
      </MDBContainer>
      <MDBContainer className="question-editor-field-group">
        <label>Image (optional):</label>
        <br/>
        <input type="file" name="file" id="file" className="input-file"/>
        <label htmlFor="file">Browse</label>
      </MDBContainer>
      {/* Question text component here. */}
      <MDBContainer className="question-editor-field-group">
        <label>Question Points:</label>
        <br/>
        <input type="number" className="input-number"/>
      </MDBContainer>
      <MDBContainer className="question-editor-field-group">
        <label>Maximum Concurrent Choices:</label>
        <br/>
        <input type="number" className="input-number"/>
      </MDBContainer>
      <MDBContainer className="question-editor-field-group">
        <label>Time limit:</label>
        <br/>
        <input type="time" className="input-time"/>
      </MDBContainer>

    </MDBContainer>
  );
}

export default React.memo(QuestionEditor);