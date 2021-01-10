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
         table.childNodes.forEach(el => el.childNodes.forEach(inEl=>inEl.className=''));
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