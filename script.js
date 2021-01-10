/*

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

*/
class Field {
    height;
    with;
    fieldObject;
    food;

    constructor() {
        this.height =19;
        this.with =19;
        this.food=null;
        this.fieldObject=document.getElementById("grid");
    };

    randomCel = () => Math.round(Math.random() * (this.with)*(this.height));

    setFoodPoint(point) {
        this.food=point;
        this.fieldObject.children[point].className = 'food';
    };

    createField() {
        for (let i = 0; i < this.height*this.with; i++) {
            const element = document.createElement('section');
            element.id=i;
            this.fieldObject.appendChild(element);
        };
    };

    clear() {
        this.fieldObject.childNodes.forEach(ch=>ch.className='');
    }
};

class Snake {
    shape=[];
    constructor() {
        this.reset();
    };
    reset() {
        this.shape = [2,1,0];
    }
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
    counter;

    constructor(field, snake) {
        this.field=field;
        this.snake=snake;
        this.timer = null;
        this.counter=0;
        this.score = document.getElementById('score');;
        this.fasterButton = document.getElementById("faster");
        this.slowerButton = document.getElementById("slower");
        document.addEventListener('keydown', this.switchDirection);
        this.fasterButton.addEventListener('click', this.faster);
        this.slowerButton.addEventListener('click', this.slower);
    };

    initGame() {
        this.field.createField();
    };

    startGame() {
        this.speed=1000;
        this.direction="ArrowRight";
        this.snake.reset();
        this.field.clear();
        this.renderSnake(this.snake.shape);
        this.setTimerSpeed();
        this.putFood();
    }

    faster=()=>{
        if (this.speed>100) {
            this.speed-=100;
            this.setTimerSpeed();
        }
        console.log(this.speed);
    }

    slower=()=>{
        if (this.speed<1000) {
            this.speed+=100;
            this.setTimerSpeed();
        }
        console.log(this.speed);
    }

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
    }

    putFood() {
        let foodPoint = this.field.randomCel();
        while(this.snake.crossSection(foodPoint)) {
            foodPoint = this.field.randomCel();
        };

        this.field.setFoodPoint(foodPoint);
    };

    acceleration() {
        if (this.counter<3) {
            this.counter++;
        } else {
            this.counter=1;
            this.fasterButton.click();
        };
    };

    setTimerSpeed=()=> {
        clearInterval(this.timer);
        this.timer = setInterval(this.step, this.speed);
    }

    step = () => {
        let rowFail = false;
        const snakeTail = this.snake.shape[this.snake.shape.length-1];
        this.snake.move();
        let checkSnakeAfter;
        const checkSnakeBefore = this.snake.shape[1]%this.field.with;
        switch (this.direction) {
            case 'ArrowUp':
                this.snake.shape[0]-=this.field.with;
                break;
            case 'ArrowRight':
                this.snake.shape[0]+=1;
                checkSnakeAfter = this.snake.shape[0]%this.field.with;
                rowFail = (checkSnakeAfter === 0) && (checkSnakeBefore === this.field.with-1);
                break;
            case 'ArrowDown':
                this.snake.shape[0]+=this.field.with;
                break;
            case 'ArrowLeft':
                this.snake.shape[0]-=1;
                checkSnakeAfter = this.snake.shape[0]%this.field.with;
                rowFail = (checkSnakeBefore === 0) && (checkSnakeAfter === this.field.with-1);
                break;
            default:
                break;
        };
        let nextCell =document.getElementById(this.snake.shape[0]);
        if (!!nextCell && nextCell.className !== 'snake' && !rowFail) {
            if (this.snake.shape[0] ===  this.field.food) {
                this.snake.shape.push(snakeTail);
                document.getElementById(snakeTail).className='snake';
                document.getElementById(this.field.food).className='snake';
                this.putFood();
                this.score.textContent=+this.score.textContent+1100-this.speed;
                this.acceleration();
            } else {
                document.getElementById(snakeTail).className='';
                document.getElementById(this.snake.shape[0]).className='snake';
            }
        } else {
            alert(this.score.textContent);
            this.startGame()
        }
    }

    renderSnake(shape) {
        shape.forEach(id => {
            this.field.fieldObject.children[id].className='snake';
        });
    }
}

const field = new Field();
const snake = new Snake();
const game = new Game(field, snake);

game.initGame();
game.startGame();