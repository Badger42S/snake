/*
const table = document.getElementById("grid");
const fasterBtoon = document.getElementById("faster");
const slowerBtoon = document.getElementById("slower");
const score = document.getElementById('score');

let headPosition = 2;
let snake = [];
const FIELD_LENGTH =19; 
let isFood =false;
let direction = "ArrowRight";
let speed = 1000;
let timer;
let fastCounter =1;

let acceleration =()=>{
    if (fastCounter<3) {
        fastCounter++;
    } else {
        fastCounter=1;
        fasterBtoon.click();
    }
};

let step= (way)=> {
    let privState =headPosition;
    let rowFail =false;
    switch (way) {
        case 'ArrowUp':
             headPosition-=FIELD_LENGTH;
            break;
        case 'ArrowRight':
            headPosition+=1;
            rowFail = (headPosition%(FIELD_LENGTH) === 0) && (privState%(FIELD_LENGTH) === 18);
            break;
        case 'ArrowDown':
            headPosition+=FIELD_LENGTH;
            break;
        case 'ArrowLeft':
            headPosition-=1;
            rowFail = (privState%(FIELD_LENGTH) === 0) && (headPosition%(FIELD_LENGTH) === 18);
            break;
        default:
            break;
    };
    let nextCell =document.getElementById(headPosition);
    if (!!nextCell && nextCell.className !== 'select' && !rowFail) {
        if (nextCell.className !== 'food') {
         document.getElementById(snake.pop()).className = '';
        } else {
         isFood =false;
         score.textContent=+score.textContent+1100-speed;
         acceleration();
        }
        document.getElementById(headPosition).className = 'select';
        snake.unshift(headPosition);
     } else {
         alert(score.textContent);
         table.childNodes.forEach(el => el.className='');
         iniPosition();
    }
}

const randomCel =() =>{ return Math.round(Math.random() * (FIELD_LENGTH)*(FIELD_LENGTH))};
let foodForSnake =(moveSpeed) =>{
    clearInterval(timer);
    timer=setInterval(()=>{
        step(direction);
        if (!isFood) {
            let food =randomCel();
            while (document.getElementById(food).className === 'select') {
                food = randomCel();
            }
            console.log(food);
                document.getElementById(food).className='food';  
            isFood =true;
        }
    }, moveSpeed);
}

fasterBtoon.addEventListener('click', ()=>{
    if (speed>100) {
        speed-=100;
        foodForSnake(speed);
    }
})

slowerBtoon.addEventListener('click', ()=>{
    if (speed<1000) {
        speed+=100;
        foodForSnake(speed);
    }
})

let iniPosition =() => {for (let i = 0; i < 3; i++) {
    let startPosition = document.getElementById(i);
    startPosition.className = 'select';
    snake = [2,1,0];   
    headPosition=snake[0];
    direction ="ArrowRight";
    speed = 1000;
    score.textContent=0;
    isFood =false;
    foodForSnake(speed);
}};

for(let i=0; i<361; i++) {
    let newCell = document.createElement('section');
    newCell.id = i;
    table.appendChild(newCell);
}

document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case 'ArrowUp':
             direction='ArrowUp';
            break;
        case 'ArrowRight':
            direction='ArrowRight';
            break;
        case 'ArrowDown':
            direction='ArrowDown';
            break;
        case 'ArrowLeft':
            direction='ArrowLeft';
            break;
        default:
            break;
    };
 });

iniPosition();
*/
class Field {
    height;
    with;
    fieldObject;

    constructor() {
        this.height =19;
        this.with =19;
        this.food=null;
        this.fieldObject=document.getElementById("grid");
    };

    randomCel = () => Math.round(Math.random() * (this.with)*(this.height));

    setFoodPoint(point) {
        this.fieldObject.children[point].className = 'food';
    };

    createField() {
        for (let i = 0; i < this.height*this.with; i++) {
            const element = document.createElement('section');
            element.id=i;
            this.fieldObject.appendChild(element);
        };
    };

    renderSnake(shape) {
        let oldSnake = document.querySelectorAll('.snake');
        oldSnake.forEach(el => {
            el.className = '';
        });
        shape.forEach(id => {
            this.fieldObject.children[id].className='snake';
        });
    }
};

class Snake {
    shape=[];
    constructor() {
        this.shape = [2,1,0];
    };

    crossSection(dot) {
        return this.shape.includes(dot);
    };

    move() {
        for (let i = this.shape.length-1; i > 0; i--) {
            this.shape[i] = this.shape[i-1];
        }
    }
};

class Game {
    field;
    snake;
    speed;
    direction;
    score;
    fasterButton;
    slowerButton;
    timer;
    constructor(field, snake) {
        this.field=field;
        this.snake=snake;
        this.speed=1000;
        this.direction="ArrowRight";
        this.timer = null;
        this.score = document.getElementById('score');;
        this.fasterButton = document.getElementById("faster");
        this.slowerButton = document.getElementById("slower");
        document.addEventListener('keydown', this.switchDirection);
    };

    initGame() {
        this.field.createField();
        this.field.renderSnake(snake.shape);
    };

    switchDirection=(event) =>{
        switch (event.key) {
            case 'ArrowUp':
                 this.direction='ArrowUp';
                break;
            case 'ArrowRight':
                this.direction='ArrowRight';
                break;
            case 'ArrowDown':
                this.direction='ArrowDown';
                break;
            case 'ArrowLeft':
                this.direction='ArrowLeft';
                break;
            default:
                break;
        };
        this.step();
    }

    putFood() {
        let foodPoint = this.field.randomCel();
        while(this.snake.crossSection(foodPoint)) {
            foodPoint = this.field.randomCel();
        };

        this.field.setFoodPoint(foodPoint);
    };

    acceleration () {
        if (fastCounter<3) {
            fastCounter++;
        } else {
            fastCounter=1;
            fasterBtoon.click();
        };
    };

    setTimerSpeed() {
        clearInterval(this.timer);
        setInterval(step, this.speed);
    }

    step = () => {
        let rowFail = false;
        let checkSnakeAfter;
        let checkSnakeBefore;
        this.snake.move();
        switch (this.direction) {
            case 'ArrowUp':
                this.snake.shape[0]-=this.field.with;
                break;
            case 'ArrowRight':
                this.snake.shape[0]+=1;
                checkSnakeAfter = this.snake.shape[0]%this.field.with;
                checkSnakeBefore = this.snake.shape[1]%this.field.with;
                rowFail = (checkSnakeAfter === 0) && (checkSnakeBefore === this.field.with-1);
                break;
            case 'ArrowDown':
                this.snake.shape[0]+=this.field.with;
                break;
            case 'ArrowLeft':
                this.snake.shape[0]-=1;
                checkSnakeAfter = this.snake.shape[0]%this.field.with;
                checkSnakeBefore = this.snake.shape[1]%this.field.with;
                rowFail = (checkSnakeBefore === 0) && (checkSnakeAfter === this.field.with-1);
                break;
            default:
                break;
        };
        console.log(rowFail);
        let nextCell =document.getElementById(this.snake.shape[0]);
        // if (!!nextCell && nextCell.className !== 'snake' && !rowFail) {
        //     if (nextCell.className !== 'food') {
        //     document.getElementById(snake.pop()).className = '';
        //     } else {
        //     isFood =false;
        //     score.textContent=+score.textContent+1100-speed;
        //     acceleration();
        //     }
        //     document.getElementById(headPosition).className = 'select';
        //     snake.unshift(headPosition);
        // } else {
        //     alert(score.textContent);
        //     table.childNodes.forEach(el => el.className='');
        //     iniPosition();
        // }
        this.field.renderSnake(snake.shape);
    }
}

const field = new Field();
const snake = new Snake();
const game = new Game(field, snake);

game.initGame();