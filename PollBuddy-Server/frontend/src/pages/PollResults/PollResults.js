import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import "./PollResults.scss";
export default class PollResults extends Component {
  componentDidMount(){
    this.props.updateTitle("Poll Data View");
  }

  state = {
    dataBar: {
      labels: ["Hooman", "Snek", "Pupper", "Catto", "Doggo", "Birb"],
      datasets: [
        {
          data: [3, 64, 91, 11, 85, 42],
          backgroundColor: [
            "rgba(255, 134,159,0.5)",
            "rgba(98,  182, 239,0.5)",
            "rgba(255, 218, 128,0.5)",
            "rgba(113, 205, 205,0.5)",
            "rgba(170, 128, 252,0.5)",
            "rgba(255, 177, 101,0.5)"
          ],
          borderWidth: 5,
          borderColor: [
            "rgba(255, 134, 159, 1)",
            "rgba(98,  182, 239, 1)",
            "rgba(255, 218, 128, 1)",
            "rgba(113, 205, 205, 1)",
            "rgba(170, 128, 252, 1)",
            "rgba(255, 177, 101, 1)"
          ]
        }
      ]
    },
    barChartOptions: {
      legend: { display: false },
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


  render() {
    return (

      <MDBContainer fluid className="page">
        <MDBContainer fluid className="two-box">
          <MDBContainer className="pollDataView-questions box">
            <p>
              CSCI 1200 - Data Structures
            </p>
            <p>
              Lesson #10
            </p>

            <Link to={"/polls/:pollID/results"}>
              <button className="btn button">Question 1</button>
            </Link>
            <Link to={"/polls/:pollID/results"}>
              <button className="btn button">Question 2</button>
            </Link>
            <Link to={"/polls/:pollID/results"}>
              <button className="btn button">Question 3</button>
            </Link>
            <Link to={"/polls/:pollID/results"}>
              <button className="btn button">Question 4</button>
            </Link>
            <Link to={"/polls/:pollID/results"}>
              <button className="btn button">Question 5</button>
            </Link>

          </MDBContainer>
          <MDBContainer fluid className="pollDataView-graph box">
            <p>
              Question 1: Who is the bestest boi?
            </p>
            <p>
              Correct Answer: Pupper
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
