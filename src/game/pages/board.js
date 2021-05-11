import React from "react";
import './board.css'

export default class Board extends React.Component {
   state = {
     grid: [],
     food: this.getRandomFood(),
     die: false,
     scoreSale: 10,
     snake: {
       head:  this.getCenter(),
       tail: []
     },
     direction: 'right'
   }

   getRandomFood() {
     const i = Math.floor(Math.random() * 10);
     const j =  Math.floor(Math.random() * 10);
     return {i, j}
   }
   createGrid(state = null, returnState) {
     if(!state) {
       state = {...this.state}
     }
     const grid = [];
     for(let i=0; i < 10; i++) {
       for(let j=0; j < 10; j++) {
         grid.push({i: i, j: j, isFood: (state.food.i === i && state.food.j === j),
          isSnake: state.snake.head.i === i && state.snake.head.j === j,
          isTail: state.snake.tail.some(t => t.i === i && t.j === j),
        })
       }
     }
     if(returnState) {
      return grid;
     } else {
       this.setState({grid: grid})
     }
   }

   getCenter() {
     const i = Math.floor(10 / 2);
     const j = Math.floor(10 / 2);
    return {i, j}
   }
   componentDidMount() {
     document.addEventListener('keydown', this.onKeyPressHandler)
     this.createGrid(null, false);
     window.fnInterval = setInterval(() => {
      this.moveSnake();
     }, 1100)
   }

   onKeyPressHandler = (e) => {
     let {direction} = this.state;
     if(e.keyCode === 40) {
    }

    switch(e.keyCode) {
      case 40:
         direction = 'down';
         break;
      case 38:
          direction = 'up';
          break;
      case 39:
          direction = 'right';
          break;
      case 37:
          direction = 'left';
          break;
     }
   //  this.moveSnake(direction)
     this.setState({...this.state, direction: direction})
   }

   moveSnake() {
     const {direction} = this.state;
     let {i, j} = this.state.snake.head;
    let {tail } = this.state.snake
     // Snake eats
     tail.unshift({
      i: i,
      j: j,
    })

    let {food} = this.state;
    if (i === this.state.food.i && j === this.state.food.j) {
      food = this.getRandomFood();
    } else {
      tail.pop();
    }
     let currentRow = this.state.snake.head.i;
     let currentColumn = this.state.snake.head.j;
    switch(direction){
      case 'right':
        currentColumn++;
        break;
      case 'left':
        currentColumn--;
        break;
      case 'up':
        currentRow--;
        break;
      case 'down':
        currentRow++;
        break;
    }
    let die = false;
    if(currentRow < 0 || currentRow > 9 || currentColumn < 0 || currentColumn > 9) {
      die = true;
    }
   const grid = this.createGrid({...this.state, snake: {...this.state.snake, head: {i: currentRow, j:currentColumn}}}, true);
   this.setState({...this.state, snake: {...this.state.snake ,head: {i: currentRow, j:currentColumn}}, grid: grid, food: food, die: die})

   }

   componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onKeyPressHandler);
    clearInterval(window.fnInterval);
  }

   render() {
     let gridContent;
     if(!this.state.die) {
       gridContent =  this.state.grid.map(ind => <div key={ind.i + ' ' + ind.j} className={"board-cell" + (ind.isSnake || ind.isTail? ' is_Snake':  (ind.isFood? ' is_Food' : ''))}></div>)
     } else {
       gridContent = <div><p>Game End</p><p>{'Your score is: ' + this.state.snake.tail.length * this.state.scoreSale }</p></div>
     }
     return (<div>
       <p>Snake Game</p>
       <div className="board-container">{gridContent}</div>
       </div>)
  }
}
