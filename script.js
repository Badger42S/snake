class Field {
    height;
    width;
    fieldObject;
    foodPoint;
    snake;

    constructor() {
        this.height =19;
        this.width =19;
        this.food=null;
        this.fieldObject=document.getElementById("grid");
    };

    createField() {
        for (let i = 0; i < this.height*this.width; i++) {
            const element = document.createElement('section');
            element.id=i;
            this.fieldObject.appendChild(element);
        };
        this.fieldObject.style.gridTemplateColumns =`repeat(${this.width},20px)`;
        this.fieldObject.style.gridTemplateRows =`repeat(${this.height},20px)`;
    };

    deleteFIeld() {
        this.fieldObject.innerHTML='';
    }

    resetField() {
        this.snake.reset();
        this.fieldObject.childNodes.forEach(ch=>ch.className='');
        this.putFood();
        this.drawSnake();
    }

    randomCel(){
        return  Math.round(Math.random() * (this.width)*(this.height))
    };

    putFood() {
        this.foodPoint = this.randomCel();
        while(this.snake.crossSection(this.foodPoint)) {
            this.foodPoint = this.randomCel();
        };
        this.fieldObject.children[this.foodPoint].className = 'food';
    }

    drawSnake() {
        this.snake.shape.forEach(id => {
            this.fieldObject.children[id].className='snake';
        });
    }

    renderMovie(direction) {
        let fail = false;
        let score = false;
        const snakeTail = this.snake.shape[this.snake.shape.length-1];
        this.snake.move();
        switch (direction) {
            case 'ArrowUp':
                this.snake.shape[0]-=this.width;
                break;
            case 'ArrowDown':
                this.snake.shape[0]+=this.width;
                break;
            case 'ArrowRight':
                fail = this.snake.shape[0]%this.width === this.width-1;
                this.snake.shape[0]+=1;
                break;
            case 'ArrowLeft':
                fail = this.snake.shape[0]%this.width === 0;
                this.snake.shape[0]-=1;
                break;
            default:
                break;
        };
        let nextCell =document.getElementById(this.snake.shape[0]);
        if (!!nextCell && nextCell.className !== 'snake' && !fail) {
            if (this.snake.shape[0] !==  this.foodPoint) {
                document.getElementById(snakeTail).className='';
            } else {
                this.snake.shape.push(snakeTail);
                //document.getElementById(snakeTail).className='snake';
                //document.getElementById(this.foodPoint).className='snake';
                this.putFood();
                score = true;
            }
            document.getElementById(this.snake.shape[0]).className='snake';
        } else {
            fail=true;
        }
        
        return {fail, score};
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
    speedLabel;
    fieldWidth;
    fieldHeight;
    fasterButton;
    slowerButton;
    sizeButton;
    timer;
    counter;

    constructor(field) {
        this.field=field;
        this.timer = null;
        this.counter=0;
        this.score = document.getElementById('score');
        this.speedLabel = document.getElementById('speed');
        this.fasterButton = document.getElementById("faster");
        this.slowerButton = document.getElementById("slower");
        this.fieldHeight = document.getElementById('height');
        this.fieldWidth = document.getElementById('width');
        this.sizeButton = document.getElementById("size");
        document.addEventListener('keydown', this.switchDirection);
        this.fasterButton.addEventListener('click', this.faster);
        this.slowerButton.addEventListener('click', this.slower);
        this.sizeButton.addEventListener('click', this.size);
    };

    initGame() {
        this.field.createField();
    };

    startGame() {
        this.speed=1000;
        this.showSpeed();
        this.score.textContent=0;
        this.direction="ArrowRight";
        this.field.resetField();
        this.setTimerSpeed();
    }

    faster=()=>{
        if (this.speed>100) {
            this.speed-=100;
            this.setTimerSpeed();
        }
        this.showSpeed();
        console.log(this.speed);
    }

    slower=()=>{
        if (this.speed<1000) {
            this.speed+=100;
            this.setTimerSpeed();
        }
        this.showSpeed();
        console.log(this.speed);
    }

    showSpeed() {
        this.speedLabel.textContent = (1100-this.speed)/100;
    }

    size =()=>{
        clearInterval(this.timer);
        this.field.deleteFIeld();
        let height= +this.fieldHeight.value;
        let width= +this.fieldWidth.value;
        if (height > 9 && height<31) {
            this.field.height = height;
        }
        if (width > 9 && width<31) {
            this.field.width = width;
        }
        this.field.createField();
        this.startGame();
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
        const {fail, score} = this.field.renderMovie(this.direction);
        
        if (score) {
            this.score.textContent=+this.score.textContent+1100-this.speed;
            this.acceleration();
        };

        if (fail) {
            alert(this.score.textContent);
            this.startGame()
        };
    }

    injectSnake(snake) {
        this.field.snake=snake;
    }
}

const field = new Field();
const snake = new Snake();
const game = new Game(field, snake);

game.injectSnake(snake);
game.initGame();
game.startGame();