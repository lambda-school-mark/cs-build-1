import React, { Component } from "react";
import "./Game.css";
import Rules from "./Rules/Rules";

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      rules: new Rules(),
      size: [30, 30],
      gameRunning: false,
      interval: 100,
    };

    this.renderBoard = this.renderBoard.bind(this);
  }

  handleRowChange(event) {
    if (!this.state.gameRunning) {
      var actualSize = this.state.size;

      actualSize[1] = event.target.value;

      this.setState({
        size: actualSize,
      });

      this.renderBoard();
    }
  }

  handleColumnChange(event) {
    if (!this.state.gameRunning) {
      var actualSize = this.state.size;
      if (event.target.value < 90) actualSize[0] = event.target.value;
      else actualSize[0] = 90;

      this.setState({
        size: actualSize,
      });

      this.renderBoard();
    }
  }

  changeInterval = (event) => {
    if (!this.state.gameRunning) {
      this.setState({
        interval: event.target.value,
      });
    }
  };

  fastSpeed = () => {
    if (!this.state.gameRunning) {
      this.setState({
        interval: 50,
      });
    }
  };

  slowSpeed = () => {
    if (!this.state.gameRunning) {
      this.setState({
        interval: 200,
      });
    }
  };

  startGame() {
    if (!this.state.gameRunning) {
      this.setState(
        {
          gameRunning: true,
        },
        () => {
          this.intervalRef = setInterval(
            () => this.runGame(),
            this.state.interval
          );
        }
      );
    }
  }

  stopGame() {
    this.setState(
      {
        gameRunning: false,
      },
      () => {
        if (this.intervalRef) {
          clearInterval(this.intervalRef);
        }
      }
    );
  }

  runGame() {
    this.setState({
      rules: this.state.rules.addGen(),
    });
  }

  clearGame() {
    this.setState(
      {
        gameRunning: false,
      },
      () => {
        if (this.intervalRef) {
          clearInterval(this.intervalRef);
        }
      }
    );
    this.state.rules.clearCell();
  }

  storeCell(position) {
    if (!this.state.gameRunning) {
      this.setState({
        rules: this.state.rules.storeCell(position),
      });
    }
  }

  renderBoard() {
    var newBoard = [];
    var cellRow = [];

    for (var i = 0; i < this.state.size[0]; i++) {
      for (var j = 0; j < this.state.size[1]; j++) {
        if (this.state.rules.aliveCell(i + " , " + j)) {
          cellRow.push(
            <Cell
              key={[i, j]}
              position={{ x: i, y: j }}
              live={true}
              storeCell={(position) => this.storeCell(position)}
            />
          );
        } else {
          cellRow.push(
            <Cell
              key={[i, j]}
              position={{ x: i, y: j }}
              live={false}
              storeCell={(position) => this.storeCell(position)}
            />
          );
        }
      }
      newBoard.push(
        <div className="row" key={i}>
          {cellRow}
        </div>
      );
      cellRow = [];
    }

    return newBoard;
  }

  render() {
    return (
      <div className="worldContainer">
        <div className="headerContainer">
          <div className="headerInnerContainer">
            <h1> Game of Life </h1>
            <h3>Rules:</h3>
            <p>
              1. Any live cell with two or three live neighbours survives.
              <br></br> 2. Any dead cell with three live neighbours becomes a
              live cell.<br></br> 3. All other live cells die in the next
              generation. Similarly, all other dead cells stay dead.
            </p>
            <br></br>
            <label className="label">
              Rows:
              <input
                className="input"
                type="text"
                value={this.state.size[1]}
                onChange={(event) => this.handleRowChange(event)}
              />
            </label>
            <label className="label">
              Columns:
              <input
                className="input"
                type="text"
                value={this.state.size[0]}
                onChange={(event) => this.handleColumnChange(event)}
              />
            </label>
            <label className="label">
              Speed:
              <button
                className="submit"
                onClick={(event) => this.slowSpeed(event)}
              >
                Slow
              </button>
              <button
                className="submit"
                onClick={(event) => this.fastSpeed(event)}
              >
                Fast
              </button>
            </label>
            <label className="label">
              Custom Speed:
              <input
                className="input"
                type="text"
                value={this.state.interval}
                onChange={(event) => this.changeInterval(event)}
              />
            </label>
          </div>
          <div className="headerButtons">
            <label>Generation: {this.state.rules.getGen()}</label>
            <br></br>
            <button className="playGame" onClick={() => this.startGame()}>
              Start
            </button>
            <button className="playGame" onClick={() => this.stopGame()}>
              Stop
            </button>
            <button className="playGame" onClick={() => this.clearGame()}>
              Clear
            </button>
          </div>
        </div>
        <div className="boardContainer">{this.renderBoard()}</div>
      </div>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <div
        onClick={() => this.props.storeCell(this.props.position)}
        className={this.props.live ? "cellContainerLive" : "cellContainerDead"}
      ></div>
    );
  }
}
