import React from "react";
import "./QuestionResults.scss";
/* eslint-disable-next-line */
import { Chart as ChartJS } from 'chart.js/auto'; // TODO: Use tree-shaking.
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

const BAR_CHART_OPTIONS = {
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
};

const DATA_BAR = (labels, data) => ({
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
});

function QuestionResults({ data: inData }) {
  const { question, questionNumber } = inData;
  const { responses, answers, text } = question;
  const labels = [], data = [];

  for (const answer of answers) {
    labels.push(answer.text);
    data.push(answer.count);
  }

  return (
    <MDBContainer className="box">
      <p className="fontSizeLarge questionText">
        {"Question " + questionNumber + ": " + text}
      </p>
      <Bar data={DATA_BAR(labels, data)} options={BAR_CHART_OPTIONS}/>
      <p className="fontSizeSmall questionText">
        {responses + " Total Responses"}
      </p>
    </MDBContainer>
  );
}

export default React.memo(QuestionResults);