import React, {Component} from 'react';
import './question.scss'
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBContainer, MDBBtn,
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
        this.deselectChoice = this.deselectChoice.bind(this);
        this.selectChoice = this.selectChoice.bind(this);
        let data = getDataFromJSON();
        let tempArray = [];
        for(let i = 0; i < data.choices.length; i++){
            tempArray.push(false);
        }
        this.state = {
            data: data,
            studentChoices: tempArray,
        }
    }

    deselectChoice(index){
        let tempChoices = this.state.studentChoices;
        tempChoices[index] = false;
        this.setState(prevState => ({
                    ...prevState,
                    studentChoices: tempChoices,
                }
            )
        )
    }

    selectChoice(index){
        let tempChoices = this.state.studentChoices;
        let count = 0;
        for(let i = 0; i < this.state.studentChoices.length; i++){
            if(this.state.studentChoices[i]){
                count++;
            }
        }
        if(count >= this.state.data.maxAllowedChoices){
            for(let i = 0; i < this.state.studentChoices.length; i++){
                if(this.state.studentChoices[i]){
                    tempChoices[i] = false;
                    break;
                }
            }
        }
        tempChoices[index] = true;
        this.setState(prevState => ({
            ...prevState,
            studentChoices: tempChoices,
        }))
    }

    render() {
        return (
            <MDBCol>
                <MDBCard>
                    <MDBCardImage className="img-fluid" src={this.state.data.img} waves />
                    <MDBCardBody>
                        <MDBCardTitle>{this.state.data.title}</MDBCardTitle>
                        <MDBCardText>{this.state.data.question}</MDBCardText>
                        <MDBCardText>
                            {this.state.data.choices.map((choice, index) => {
                                if(this.state.studentChoices[index]){
                                    return (
                                        <MDBBtn onClick={() => {return this.deselectChoice(index)}}>
                                            {choice}
                                        </MDBBtn>
                                    )
                                }else{
                                    return (
                                        <MDBBtn
                                            outline
                                            onClick={() => {return this.selectChoice(index)}}>
                                            {choice}
                                        </MDBBtn>
                                    )
                                }
                            })}
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