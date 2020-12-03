import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import "./PollResults.scss";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";

export default class PollResults extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      doneLoading: false,
      questionData: {},
      dataBar: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              "rgba(255, 134,159,0.5)",
              "rgba(98,  182, 239,0.5)",
              "rgba(255, 218, 128,0.5)",
              "rgba(113, 205, 205,0.5)",
              "rgba(170, 128, 252,0.5)",
            ],
            borderWidth: 5,
            borderColor: [
              "rgba(255, 134, 159, 1)",
              "rgba(98,  182, 239, 1)",
              "rgba(255, 218, 128, 1)",
              "rgba(113, 205, 205, 1)",
              "rgba(170, 128, 252, 1)",
            ]
          }
        ]
      },
      barChartOptions: {
        legend: {display: false},
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [
            {
              barPercentage: 1,
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: "white",
                fontSize: 20,
                fontFamily: "Fredoka One",
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: "rgba(255, 255, 255, 0.5)"
              },
              ticks: {
                beginAtZero: true,
                fontColor: "white",
                fontSize: 20,
                fontFamily: "Fredoka One",
              }
            }
          ]
        }
      }
    };
  }

  componentDidMount() {
    this.props.updateTitle("Poll Results");

    console.log(this.props.match.params.pollID);

    fetch(process.env.REACT_APP_BACKEND_URL + "/polls/" + this.props.match.params.pollID + "/results", {
      method: "GET"
    })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong");
          }

        })
        .then(response => {
          if (response === {}) {
            console.log("Error fetching data");
          } else {
            console.log("Fetching data succeeded");
            console.log(response);
            this.setState({"questionData": response, "doneLoading": true});
            this.state.dataBar.labels = this.state.questionData.Results[0].AnswerChoices;
            this.state.dataBar.datasets[0].data = this.state.questionData.Results[0].Tallies;
            console.log(this.state.dataBar.labels);
            console.log(this.state.dataBar.datasets[0].data);
          }
        })
        .catch(error => this.setState({"error": error}));
  }

  render() {
    if (this.state.error != null) {
      return (
          <MDBContainer fluid className="page">
            <MDBContainer fluid className="box">
              <p className="fontSizeLarge">
                Error loading data! Please try again.
              </p>
            </MDBContainer>
          </MDBContainer>
      );
    } else if (!this.state.doneLoading) {
      return (
          <MDBContainer>
            <LoadingWheel/>
            <button className="btn button" onClick={this.stopLoading}>End Loading</button>
          </MDBContainer>
      );
    } else {
      return (

        <MDBContainer fluid className="page">
          <MDBContainer fluid className="two-box">

            <MDBContainer fluid className="PollResults-graph box">
              <p>
                {"Question " + this.state.questionData.Results[0].QuestionNumber + ": " + this.state.questionData.Results[0].QuestionText}
              </p>
              <p>
                {"Correct Answers: " + this.state.questionData.Results[0].CorrectAnswers}
              </p>
              <p>
                Total Number of Answers: 296
              </p>

              {/*The MDBReact Bar component was built on top of chart.js.
                      Look at https://www.chartjs.org/docs/latest/ for more info*/}
              <Bar data={this.state.dataBar} options={this.state.barChartOptions}/>
            </MDBContainer>
          </MDBContainer>
        </MDBContainer>
      );
    }
  }
}
