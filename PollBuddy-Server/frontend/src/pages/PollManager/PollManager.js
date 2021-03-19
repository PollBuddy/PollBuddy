import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import Countdown, {zeroPad} from "react-countdown";

export default class PollManager extends Component {
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
              fontSize: 16,
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
              fontSize: 16,
            }
          }
        ]
      }
    }
  };


  timeLimit = 5;

  render() {
    const clockFormat = ({ minutes, seconds, completed }) => {

      if (completed) {
        // Render a completed state
        return <p className="fontSizeLarge"> Question closed! </p>;
      } else {
        // Render a countdown
        return <p className="fontSizeLarge">{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
      }
    };
    return (

      <MDBContainer fluid className="page">
        <MDBContainer fluid className="pollDataView-page">
          <MDBContainer className="pollDataView-questions">

            <MDBContainer>
              <select className="btn button">
                <option>Choose a Group</option>
                <option value="1">Data Structures</option>
                <option value="2">FOCS</option>
                <option value="3">Algorithms</option>
              </select>
            </MDBContainer>

            <MDBContainer>
              <select className="btn button">
                <option>Choose a Poll</option>
                <option value="1">Poll 1 - Vectors</option>
                <option value="2">Poll 2 - Lists</option>
                <option value="3">Poll 3 - Maps</option>
              </select>
            </MDBContainer>

            <p className="fontSizeLarge">
              Time remaining:
            </p>
            <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit*1000} />

            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Next Question</button>
            </Link>
            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Select Question</button>
              {/* TODO: When pressed, show a (popup or something) dropdown menu of question titles to pick */}
            </Link>
            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Disable Further Poll Answers</button>
            </Link>
            {/* TODO: Don't show both disable and enable, only show the opposite of the current status */}
            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Enable Further Poll Answers</button>
            </Link>
            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Display Statistics to Poll Viewers</button>
            </Link>
            <Link to={"/polls/:pollID/manage"}>
              <button className="button">Display Correct Answer to Poll Viewers</button>
            </Link>


          </MDBContainer>
          <MDBContainer fluid className="bigger box">
            <p className="fontSizeLarge">
              Poll Results
            </p>
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
