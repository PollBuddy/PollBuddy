import React from "react";
import "./QuestionResults.scss";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

/*----------------------------------------------------------------------------*/

const BAR_CHART_OPTIONS = {
  plugins: {
    legend: { display: false },
  },
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      barPercentage: 1,
      grid: { color: "rgba(255, 255, 255, 0.5)" },
      ticks: { color: "white" },
    },
    y: {
      grid: { color: "rgba(255, 255, 255, 0.5)" },
      ticks: {
        beginAtZero: true,
        precision: 0,
        stepSize: 1,
        min: 0,
        color: "white",
      },
    },
  },
};

const DATASET_OPTIONS = {
  label: "Number of Votes",
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
  ],
};

/*----------------------------------------------------------------------------*/

function QuestionResults(props) {
  const { question, questionNumber } = props.data;
  const labels = [], data = [];
  
  const totalResponses = question.responses;
  for (const answer of question.answers) {
    labels.push(answer.text);
    data.push(answer.count);
  }

  const dataBar = {
    labels: labels,
    datasets: [{ data: data, ...DATASET_OPTIONS }],
  };

  return (
    <MDBContainer className="box">
      <p className="fontSizeLarge questionText">
        {`Question ${questionNumber}: ${question.text}`}
      </p>
      <Bar data={dataBar} options={BAR_CHART_OPTIONS}/>
      <p className="fontSizeSmall questionText">
        {`${totalResponses} Total Responses`}
      </p>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default QuestionResults;