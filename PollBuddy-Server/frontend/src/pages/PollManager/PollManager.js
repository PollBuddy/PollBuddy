import React from "react";
/* eslint-disable-next-line */
import { Chart as ChartJS } from 'chart.js';
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import Countdown from "react-countdown";
import { withRouter } from "../../components";
import { useTitle } from "../../hooks";

const DATA_BAR = {
  labels: ["Hooman", "Snek", "Pupper", "Catto", "Doggo", "Birb"],
  datasets: [
    {
      data: [ 3, 64, 91, 11, 85, 42 ],
      backgroundColor: [
        "rgba(255, 134, 159, 0.5)", "rgba(98,  182, 239, 0.5)",
        "rgba(255, 218, 128, 0.5)", "rgba(113, 205, 205, 0.5)",
        "rgba(170, 128, 252, 0.5)", "rgba(255, 177, 101, 0.5)",
      ],
      borderWidth: 5,
      borderColor: [
        "rgba(255, 134, 159, 1)", "rgba(98,  182, 239, 1)",
        "rgba(255, 218, 128, 1)", "rgba(113, 205, 205, 1)",
        "rgba(170, 128, 252, 1)", "rgba(255, 177, 101, 1)",
      ],
    },
  ],
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
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
          color: "rgba(255, 255, 255, 0.5)",
        },
        ticks: {
          beginAtZero: true,
          fontColor: "white",
          fontSize: 16,
        },
      },
    ],
  }
};

const CHART_OPTIONS = {
  legend: { display: false },
  responsive: true,
  maintainAspectRatio: true,
};

function clock({ formatted: { days, hours, minutes, seconds }, completed }) {
  if (completed) {
    // Render a completed state.
    return <p className="fontSizeLarge">Question closed!</p>;
  } else {
    // Render a countdown.
    return <p className="fontSizeLarge">{days}:{hours}:{minutes}:{seconds}</p>;
  }
}

function PollManager() {
  useTitle("Poll Data View");

  const timeLimit = 5;

  return (
    <MDBContainer fluid className="page">
      <MDBContainer fluid className="two-box two-box-different">
        <MDBContainer className="smaller box">
          <p>CSCI 1200 - Data Structures</p>
          <p>Lesson #10</p>

          <p className="fontSizeLarge">Time remaining:</p>
          <Countdown renderer={clock} date={timeLimit}/>

          <Link to="/polls/:pollID/manage">
            <button className="button">Next Question</button>
          </Link>
          <Link to="/polls/:pollID/manage">
            <button className="button">Select Question</button>
            {/* TODO: When pressed, show a (popup or something) dropdown menu
                of question titles to pick */}
          </Link>
          <Link to="/polls/:pollID/manage">
            <button className="button">Disable Further Poll Answers</button>
          </Link>
          {/* TODO: Don't show both disable and enable, only show the opposite
              of the current status */}
          <Link to="/polls/:pollID/manage">
            <button className="button">Enable Further Poll Answers</button>
          </Link>
          <Link to="/polls/:pollID/manage">
            <button className="button">Display Statistics to Poll Viewers</button>
          </Link>
          <Link to="/polls/:pollID/manage">
            <button className="button">Display Correct Answer to Poll Viewers</button>
          </Link>
        </MDBContainer>

        <MDBContainer fluid className="bigger box">
          <p className="fontSizeLarge">Poll Results</p>
          <p>Question 1: Who is the bestest boi?</p>
          <p>Correct Answer: Pupper</p>
          <p>Total Number of Answers: 296</p>
          {/* The MDBReact Bar component was built on top of chart.js.
              Look at https://www.chartjs.org/docs/latest/ for more info */}
          <Bar data={DATA_BAR} options={CHART_OPTIONS}/>
        </MDBContainer>
      </MDBContainer>
    </MDBContainer>
  );
}

export default withRouter(PollManager);