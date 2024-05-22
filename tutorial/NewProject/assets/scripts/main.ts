import { _decorator, Component, find, profiler, Label, Slider } from "cc";
const { ccclass, property } = _decorator;

enum State {
  Start,
  Pause,
  Lose,
  Browse,
  Win,
  Multi,
}

enum Sign {
  X,
  O,
  NULL,
}

@ccclass("main")
export class main extends Component {
  // init params
  board: Sign[][] = [];
  state: State;
  playerName: String;
  indexMatch: number = null;
  currentTime: Date = new Date();
  protected onLoad(): void {
    profiler.hideStats();
    this.state = State.Pause;
    this.resetTable();
    this.emptyTable();
  }

  update(deltaTime: number) {
    let mainMenu = find("Canvas/MainMenu");
    let LoseWin = find("Canvas/LoseWin");
    if (this.state == State.Start && mainMenu.active) {
      mainMenu.active = false;
    }

    if (this.state == State.Multi && mainMenu.active) {
      mainMenu.active = false;
    }

    if (this.state == State.Multi) {
      let tmp = new Date();
      if (tmp.valueOf() - this.currentTime.valueOf() > 1000) {
        fetch(`http://localhost:5000/get_match/${this.indexMatch}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((data) => {
            let board = data.board;
            for (let i in board) {
              for (let j in board[i]) {
                if (board[i][j] == "b") this.board[i][j] = Sign.X;
                if (board[i][j] == "w") this.board[i][j] = Sign.O;
              }
            }
            if (data.turn == this.playerName)
              find("Canvas/YourTurn").active = true;
            else find("Canvas/YourTurn").active = false;
            if (data.winner != null) {
              if (data.winner == this.playerName) this.state = State.Win;
              else this.state = State.Lose;
            }
          });
        });
        this.currentTime = tmp;
      }
    }

    if (this.state == State.Pause && !mainMenu.active) {
      mainMenu.active = true;
    }
    if (this.state !== State.Win && this.state !== State.Lose) {
      LoseWin.active = false;
    }

    if (this.state == State.Win) {
      LoseWin.active = true;
      let label = find("Canvas/LoseWin/Label").getComponent(Label);
      label.string = "You Win";
    }
    if (this.state == State.Lose) {
      LoseWin.active = true;
      let label = find("Canvas/LoseWin/Label").getComponent(Label);
      label.string = "You Lose";
    }

    if (this.state == State.Browse) {
      let tmp = new Date();
      if (tmp.valueOf() - this.currentTime.valueOf() > 2000) {
        fetch(`http://localhost:5000/get_match_index/${this.playerName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((data) => {
            if (data.id != null) {
              this.indexMatch = data.id;
              this.state = State.Multi;
            }
          });
        });
        this.currentTime = tmp;
      }
    }

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        let cellId = (y * 15 + x).toString();
        while (cellId.length < 3) cellId = "0" + cellId;
        let cellName = `cell-${cellId}`;
        let label = find(`Canvas/table/${cellName}/Label`).getComponent(Label);
        if (this.board[y][x] == Sign.NULL) label.string = "";
        else if (this.board[y][x] == Sign.X) label.string = "X";
        else if (this.board[y][x] == Sign.O) label.string = "O";
      }
    }
  }
  onStartBtn() {
    this.state = State.Start;
  }

  onBrowserBtn() {
    this.state = State.Browse;
    let label = find(`Canvas/MainMenu/Name/TEXT_LABEL`).getComponent(Label);
    this.playerName = label.string;
    fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify({ user: this.playerName }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });
  }

  onResetBtn() {
    this.emptyTable();
    this.resetTable();
    this.state = State.Start;
    find("Canvas/YourTurn").active = false;
  }

  onClickCell(event: Event) {
    if (this.state == State.Start) {
      let cellName: string = event.target["_name"];
      let cellId = Number(cellName.replace("cell-", ""));
      let y = Math.floor(cellId / 15);
      let x = cellId % 15;
      if (this.board[y][x] == Sign.NULL) {
        this.board[y][x] = Sign.X;
        fetch("http://localhost:5000/get_point", {
          method: "POST",
          body: JSON.stringify({ x: x, y: y }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((data) => {
            if (data.state == "win") {
              this.state = State.Win;
            } else if (data.state == "lose") {
              this.state = State.Lose;
            } else this.board[data.y][data.x] = Sign.O;
          });
        });
      }
    }
    if (this.state == State.Multi) {
      let cellName: string = event.target["_name"];
      let cellId = Number(cellName.replace("cell-", ""));
      let y = Math.floor(cellId / 15);
      let x = cellId % 15;
      if (this.board[y][x] == Sign.NULL) {
        fetch("http://localhost:5000/play", {
          method: "POST",
          body: JSON.stringify({
            index: this.indexMatch,
            user: this.playerName,
            x: x,
            y: y,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          response.json().then((data) => {
            console.log(data);
          });
        });
      }
    }
  }

  resetTable() {
    fetch("http://localhost:5000/reset", {
      method: "POST",
      body: JSON.stringify({ size: 15 }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    });
  }

  emptyTable() {
    for (let y = 0; y < 15; y++) {
      this.board[y] = new Array(15);
      for (let x = 0; x < 15; x++) this.board[y][x] = Sign.NULL;
    }
  }

  changeLevel(event: Event) {
    let level = event["node"].getComponent(Slider).progress;
    fetch("http://localhost:5000/level", {
      method: "POST",
      body: JSON.stringify({ level: level }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    });
  }

  onPause() {
    if (this.state == State.Start) this.state = State.Pause;
    else if (this.state == State.Pause) this.state = State.Start;
  }
}
