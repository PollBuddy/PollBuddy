import React, { Component } from 'react';
import { Bar } from "react-chartjs-2";
import './pollDataView.scss'
import { MDBContainer, MDBListGroup, MDBListGroupItem } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';
import Header from "../../components/header/header.js"


export default class pollDataView extends Component {
    componentDidMount(){
        document.title = "Poll Data View - " + document.title;
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
                <Header title = "poll data view" btn = "account" />
                <MDBContainer className="questions">
                    <h1 className="question_text">1200 Data Structures, Lesson #10</h1>

                    <button className="btn q1">Question 1</button>
                    <button className="btn q2">Question 2</button>
                    <button className="btn q3">Question 3</button>
                    <button className="btn q4">Question 4</button>

                </MDBContainer>

                <MDBContainer fluid className="graph">
                    <h1 className="text">Question 1: Who is the bestest boi?</h1>
                    <h1 className="text">Correct Answer: Pupper</h1>
                    <h1 className="text">Total Number of Answers: 296</h1>

                    {/*The MDBReact Bar component was built on top of chart.js.
                    Look at https://www.chartjs.org/docs/latest/ for more info*/}
                    <Bar data={this.state.dataBar} options={this.state.barChartOptions}/>
                </MDBContainer>

            </MDBContainer>

        );
    }
}
