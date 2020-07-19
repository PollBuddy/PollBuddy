import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import {Link} from "react-router-dom";
import "./pollDataView.scss";
export default class pollDataView extends Component {
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


  render() {
    return (

      <MDBContainer fluid className="page">
        <MDBContainer fluid className="pollDataView-page">
          <MDBContainer className="pollDataView-questions">
            <p className="width-90 fontSizeSmall">
              CSCI 1200 - Data Structures
            </p>
            <p className="width-90 fontSizeSmall">
              Lesson #10
            </p>

            <Link to={"/pollDataView"}>
              <button className="btn button">Question 1</button>
            </Link>
            <Link to={"/pollDataView"}>
              <button className="btn button">Question 2</button>
            </Link>
            <Link to={"/pollDataView"}>
              <button className="btn button">Question 3</button>
            </Link>
            <Link to={"/pollDataView"}>
              <button className="btn button">Question 4</button>
            </Link>
            <Link to={"/pollDataView"}>
              <button className="btn button">Question 5</button>
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