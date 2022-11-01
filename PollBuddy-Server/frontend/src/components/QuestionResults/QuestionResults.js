import React, {Component} from "react";
import "./QuestionResults.scss";
import {Bar} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";
import {MDBContainer, MDBIcon} from "mdbreact";

import Countdown, {zeroPad} from "react-countdown";

export default class QuestionResults extends Component {
  constructor(props) {
    super(props);
    let labels = [];
    let data = [];
    let totalResponses = props.data.question.responses;
    for (let answer of props.data.question.answers) {
      labels.push(answer.text);
      data.push(answer.count);
    }

    this.state = {
      questionNumber: props.data.questionNumber,
      question: props.data.question,
      totalResponses: totalResponses,
      dataBar: {
        labels: labels,
        datasets: [
          {
            label: "Number of Votes",
            data: data,
            backgroundColor: [
              "rgba(255, 134, 159, 0.5)",
              "rgba(98,  182, 239, 0.5)",
              "rgba(255, 218, 128, 0.5)",
              "rgba(113, 205, 205, 0.5)",
              "rgba(170, 128, 252, 0.5)",
              "rgba(255, 134, 159, 0.5)",
              "rgba(98,  182, 239, 0.5)",
              "rgba(255, 218, 128, 0.5)",
              "rgba(113, 205, 205, 0.5)",
              "rgba(170, 128, 252, 0.5)",
            ],
            borderWidth: 5,
            borderColor: [
              "rgba(255, 134, 159, 1)",
              "rgba(98,  182, 239, 1)",
              "rgba(255, 218, 128, 1)",
              "rgba(113, 205, 205, 1)",
              "rgba(170, 128, 252, 1)",
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
        plugins: {
          legend: {
            display: false
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            barPercentage: 1,
            grid: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            ticks: {
              color: "white",
            }
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            ticks: {
              beginAtZero: true,
              precision: 0,
              stepSize: 1,
              min: 0,
              color: "white",
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <MDBContainer className="box">
        <p className="fontSizeLarge questionText">
          {"Question " + (this.state.questionNumber) + ": " + this.state.question.text}
        </p>
        <Bar data={this.state.dataBar} options={this.state.barChartOptions}/>
        <p className="fontSizeSmall questionText">
          {this.state.totalResponses + " Total Responses"}
        </p>
      </MDBContainer>
    );
  }
}
