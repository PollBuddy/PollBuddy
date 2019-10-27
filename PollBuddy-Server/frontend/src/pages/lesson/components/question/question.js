import React, {Component} from 'react';
import './question.scss'
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBContainer,
} from 'mdbreact';
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as questionActions from "../../store/question/actions";

//this is a placeholder funcion, it will eventually be used
//to get information about the question from the database
const getDataFromJSON = () =>{
    let data = require('./dummyInfo');
    return data;
};

export default class question extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = getDataFromJSON();
        return (
            <MDBCol>
                <MDBCard style={{ width: "22rem" }}>
                    <MDBCardImage className="img-fluid" src={data.img} waves />
                    <MDBCardBody>
                        <MDBCardTitle>{data.title}</MDBCardTitle>
                        <MDBCardText>{data.question}</MDBCardText>
                        <MDBCardText>
                            {data.choices.map((choice, index) => (
                                <MDBContainer>
                                    <button className="choiceButton">{data.choices[index]}</button>
                                </MDBContainer>
                            ))}
                        </MDBCardText>
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        );
    }
  }
// export default connect(
//     ({ question }) => ({ ...question }),
//     dispatch => bindActionCreators({ ...questionActions }, dispatch)
//   )( question );