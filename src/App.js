import React from "react";
import {useState, useEffect} from 'react';
import './App.css';
import {Piece} from "./piece";
import {Butt} from "./butt";

function App() {
  const [board, setBoard] = useState([])
  const [direction, setDirection] = useState(1)
  const [location, setLocation] = useState([20, 20])
  const [snake, setSnake] = useState([[20, 20]])
  const [foodLocation, setFoodLocation] = useState([1, 1])
  const [tick, setTick] = useState(0)
  const [canChange, setCanChange] = useState(true)
  const [lost, setLost] = useState(false)
  const [paused, setPaused] = useState(true)
  const [jeff,setJeff] = useState(0)
  const [highScore,setHighScore] = useState(0)
  const stylesForBoard = {
    display: "flex",
    flexWrap: "wrap",
    width: 400
  }

  function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr))
  }

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function twoOfTheSame(someSnake) {
    let beforeList = []
    let truth = false
    someSnake.forEach((elem, index) => {
      if (!truth) {
        beforeList.forEach((element) => {
          if (arraysEqual(elem, element)) {
            truth = true
          }
        })
        beforeList.push(elem)
      }
    })
    return truth
  }

  function start() {
    let newBoard = []
    for (let a = 0; a < 40; a++) {
      newBoard.push([])
      for (let b = 0; b < 40; b++) {
        newBoard[a].push(0)

      }

    }
    if (!jeff) {
      newBoard[location[0]][location[1]] = 1
    }
    let c = moveTheFood(newBoard)
    return moveTheFood(newBoard)
  }

  function moveOnce(directionNow, locationNow, boardNow, snakeNow, foodLocNow) {
    if (boardNow.length === 40) {
      if (snake.length) {
        let tempLocation = locationNow
        if (directionNow === 1) {
          tempLocation = [locationNow[0] - 1, locationNow[1]]
        }
        if (directionNow === 2) {
          tempLocation = [locationNow[0], locationNow[1] + 1]
        }
        if (directionNow === 3) {
          tempLocation = [locationNow[0] + 1, locationNow[1]]
        }
        if (directionNow === 4) {
          tempLocation = [locationNow[0], locationNow[1] - 1]
        }
        let tempSnake = deepCopy(snakeNow)
        tempSnake.push(tempLocation)
        let tempBoard = deepCopy(boardNow)
        tempBoard[tempLocation[0]][tempLocation[1]] = 1
        let foodLoc
        if (!(arraysEqual(tempLocation, foodLocNow))) {
          tempBoard[snakeNow[0][0]][snakeNow[0][1]] = 0
          tempSnake.shift()
        } else {
          tempBoard[snakeNow[0][0]][snakeNow[0][1]] = 1
          let foodObj = moveTheFood(tempBoard)
          tempBoard = foodObj.board
          foodLoc = foodObj.foodLoc
        }
        return {snake: tempSnake, location: tempLocation, board: tempBoard, foodLoc: foodLoc}
      }
    }
  }

  function moveTheFood(inputBoard) {
    let tempBoard = deepCopy(inputBoard)
    let tempFoodLoc
    let tempNotSnake = []
    tempBoard.forEach((elem, index) => (elem.forEach((cell, column) => !snake.includes([index, column]) ? tempNotSnake.push([index, column]) : null)))
    let a = Math.random() * tempNotSnake.length
    tempFoodLoc = [tempNotSnake[Math.floor(a)][0], tempNotSnake[Math.floor(a)][1]]
    tempBoard[tempFoodLoc[0]][tempFoodLoc[1]] = 2
    return {board: tempBoard, foodLoc: tempFoodLoc}
  }

  useEffect(() => {
    let b = start()
    setBoard(b.board)
    if (b.foodLoc) {
      setFoodLocation(b.foodLoc)
    }
  }, []);
  useEffect(() => {
    let b = start()
    setBoard(b.board)
    if (b.foodLoc) {
      setFoodLocation(b.foodLoc)
    }
    setDirection(1)
    setSnake([[20,20]])
    setTick(tick-1)
    setPaused(true)
    setLost(false)
    setLocation([20,20])
  }, [jeff]);
  useEffect(() => {
    if (foodLocation !== [1, 1]) {
      let lost
      if (location[0] === 39 && direction === 3) {
        setLost(true)
        lost = true
      }
      if (location[0] === 0 && direction === 1) {
        setLost(true)
        lost = true
      }
      if (location[1] === 39 && direction === 2) {
        setLost(true)
        lost = true
      }
      if (location[1] === 0 && direction === 4) {
        setLost(true)
        lost = true
      }
      if (twoOfTheSame(snake)) {
        setLost(true)
        lost = true
      }
      if (snake.length>=highScore){
        setHighScore(snake.length)
      }
      if (board.length === 40 && !lost) {
        if (!paused) {
          let obj = moveOnce(direction, location, board, snake, foodLocation)
          setBoard(obj.board)
          setLocation(obj.location)
          setSnake(obj.snake)
          if (obj.foodLoc) {
            setFoodLocation(obj.foodLoc)
          }
        }
        setCanChange(false)
        setTimeout(() => setTick(tick + 1), 5)
      }
    }
  }, [tick])

  function calculateDirection(locationOfPiece, locationOfHead) {
    let newDirection
    let upDist = locationOfHead[0] - locationOfPiece[0]
    let rightDist = locationOfPiece[1] - locationOfHead[1]
    if (direction % 2) {
      if (rightDist > 0) {
        newDirection = 2
      } else {
        newDirection = 4
      }
    } else {
      if (upDist > 0) {
        newDirection = 1
      } else {
        newDirection = 3
      }
    }

    return newDirection
  }

  return (
    <div>
      <div>
        <div>
          Length {snake.length}
        </div>
        <div>
          {!paused ? <Butt text={'Pause'} onClick={() => setPaused(true)} color={'#F05000'}/> :
            <Butt text={'Play'} onClick={() => setPaused(false)} color={'#7000FF'}/>}
        </div>
        <div>
          <Butt text={'Restart'} onClick={()=>
            setJeff(jeff+1)
            } color={'#0000FF'}/>
        </div>
        <div>
          {lost ? 'You crashed' : null}
        </div>
        <div>
          High Score: {highScore}
        </div>
      </div>
      <div style={stylesForBoard}>
        {board.map((elem, index) =>
          elem.map((cell, column) =>
            <Piece value={cell} onClick={() => {
              if (board.length === 40 && tick === 0) {
                setTick(2)
              }
              let d = calculateDirection([index, column], location)
              if (d % 2 !== direction % 2) {
                setDirection(d)
              }
            }
            }/>
          )
        )}
      </div>
    </div>
  );
}

export default App;