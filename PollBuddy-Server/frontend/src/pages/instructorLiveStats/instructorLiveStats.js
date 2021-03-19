import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import "./instructorLiveStats.scss";
import Countdown, {zeroPad} from "react-countdown";
export default class instructorLiveStats extends Component {
  componentDidMount(){
    this.props.updateTitle("Instructor Live Statistics");
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
      maintainAspectRatio: false,
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
              color: "rgba(30,30,30, 1)"
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

  timeLimit = 5;

  render() {
    const clockFormat = ({ minutes, seconds, completed }) => {

      if (completed) {
        // Render a completed state
        return <p className="width-90 fontSizeLarge"> Question closed! </p>;
      } else {
        // Render a countdown
        return <p className="width-90 fontSizeLarge">{zeroPad(minutes)}:{zeroPad(seconds)}</p>;
      }
    };
    return (

      <MDBContainer fluid className="page">
        <MDBContainer fluid className="pollDataView-page">
          <MDBContainer className="pollDataView-questions">
            <p className="width-90 fontSizeLarge">
              Time remaining:
            </p>
            <Countdown renderer={clockFormat} date={Date.now() + this.timeLimit*1000} />

            <Link to={"/instructorLiveStats"}>
              <button className="btn button">Next Question</button>
            </Link>
            <Link to={"/instructorLiveStats"}>
              <button className="btn button">Display Statistics</button>
            </Link>
            <Link to={"/instructorLiveStats"}>
              <button className="btn button">Display Correct Answer</button>
            </Link>
            <Link to={"/instructorLiveStats"}>
              <button className="btn button">End Poll</button>
            </Link>

          </MDBContainer>
          <MDBContainer fluid className="pollDataView-graph">
            <p className="width-90 fontSizeSmall">
              Question 1: Who is the bestest boi?
            </p>
            <p className="width-90 fontSizeSmall">
              Correct Answer: Pupper
            </p>
            <p className="width-90 fontSizeSmall">
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