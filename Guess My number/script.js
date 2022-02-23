'use strict';


// document.querySelector('.message');
//
// document.querySelector('.message').textContent = 'Correct Number!';
//
// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;
//
// document.querySelector('.guess').value =23;

let secretNumber = Math.trunc(Math.random()*20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message){
    document.querySelector('.message').textContent = message;
};

const changeStyle = function (size, color){
    document.querySelector('body').style.backgroundColor = color;
    document.querySelector('.number').style.width = size;
};



document.querySelector('.check').addEventListener('click', () => {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess);

    if (!guess) {
       displayMessage('No number');
    } else if (guess === secretNumber) {
        displayMessage('Correct Number!');
        changeStyle('30rem', '#60b347')
        document.querySelector('.number').textContent = secretNumber;

        if (score > highscore) {
            highscore = score;
            document.querySelector('.highscore').textContent = highscore;
        }

    } else if (guess !== secretNumber) {
        if (score > 1) {
            displayMessage(guess > secretNumber ? 'Too high!' : 'Too Low!');
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            displayMessage('You LOST the game :(');
            document.querySelector('.score').textContent = 0;
        };
    }
});

document.querySelector('.again').addEventListener('click', () =>{
    secretNumber = Math.trunc(Math.random()*20) + 1;
    document.querySelector('.score').textContent = 20;

    displayMessage('Start guessing...');
    changeStyle('15rem', '#222')
    document.querySelector('.guess').value = '';
    document.querySelector('.number').textContent = '?';
})























