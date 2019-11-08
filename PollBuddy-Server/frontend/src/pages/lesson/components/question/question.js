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
        //binding helper functions
        this.deselectChoice = this.deselectChoice.bind(this);
        this.selectChoice = this.selectChoice.bind(this);
        //get the data from the json and store it as an object
        let data = getDataFromJSON();
        //set up an array of booleans (representing the student's answer choices)
        //and initialize it to all false
        let tempArray = [];
        for(let i = 0; i < data.choices.length; i++){
            tempArray.push(false);
        }
        //add the data and the array to state
        this.state = {
            data: data,
            studentChoices: tempArray,
        }
    }

    deselectChoice(index){
        //set the boolean in the array at the selected index to false
        //and update state
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
        //count the number of booleans that are true in the array
        for(let i = 0; i < this.state.studentChoices.length; i++){
            if(this.state.studentChoices[i]){
                count++;
            }
        }
        //if the number of true booleans is greater than the maximum number of
        //allowed choices (specified by the json) then set the entire array
        //back to false
        if(count >= this.state.data.maxAllowedChoices){
            for(let i = 0; i < this.state.studentChoices.length; i++){
                if(this.state.studentChoices[i]){
                    tempChoices[i] = false;
                }
            }
        }
        //make the boolean at the selected index true and update state
        tempChoices[index] = true;
        this.setState(prevState => ({
            ...prevState,
            studentChoices: tempChoices,
        }))
    }

    render() {
        return (
            <MDBCol>
                <MDBCard style={{ width: "22rem" }}>
                    <MDBCardImage className="img-fluid" src={this.state.data.img} waves />
                    <MDBCardBody>
                        <MDBCardTitle>{this.state.data.title}</MDBCardTitle>
                        <MDBCardText>
                            {this.state.data.question}
                        </MDBCardText>
                        {/*<MDBCardText>*/}
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
                        {/*</MDBCardText>*/}
                    </MDBCardBody>
                </MDBCard>
            </MDBCol>
        )
    }
  }
// export default connect(
//     ({ question }) => ({ ...question }),
//     dispatch => bindActionCreators({ ...questionActions }, dispatch)
//   )( question );