'use strict';
//sececting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.querySelector("#current--0");
const current1El = document.querySelector('#current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

score0El.textContent = 0;
score1El.textContent = 0;
diceEl.classList.add('hidden');

let scores = [0, 0];
let currentScore = 0;
let activePalyer = 0;
let playing = true;



const switchPlayer = function (){
    document.getElementById(`current--${activePalyer}`).textContent = 0;
    activePalyer = activePalyer === 0 ? 1 : 0;
    currentScore = 0;
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
};

//rolling dice

btnRoll.addEventListener('click', () =>{
    if(playing) {
        // generating random dice roll

        const dice = Math.trunc(Math.random() * 6) + 1;

        // display dice

        diceEl.classList.remove('hidden');
        diceEl.src = `dice-${dice}.png`;

        //check for rolled 1 if true switch player
        if (dice !== 1) {
            //add dice too current score
            currentScore += dice;
            document.getElementById(`current--${activePalyer}`).textContent = currentScore;

        } else {
            //switch player
            switchPlayer();
        }
    }
});

btnHold.addEventListener('click', ()=>{
    if(playing) {
        // add current score to active player's score
        scores[activePalyer] += currentScore;
        document.getElementById(`score--${activePalyer}`).textContent = scores[activePalyer];
        //check if player's score is =>100
        //finish
        if (scores[activePalyer] >= 100) {
            playing = false;
            document.querySelector(`.player--${activePalyer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePalyer}`).classList.remove('player--active');
            diceEl.classList.add('hidden');
        } else {
            //swich the net player
            switchPlayer();
        }
    }
});

btnNew.addEventListener('click', () =>{
    playing = true;
    scores = [0, 0];
    currentScore = 0;
    score0El.textContent = 0;
    score1El.textContent = 0;
    current0El.textContent = 0;
    current1El.textContent = 0;
    document.querySelector(`.player--${activePalyer}`).classList.remove('player--winner');
    document.querySelector(`.player--${activePalyer}`).classList.remove('player--active');
    document.querySelector(`.player--0`).classList.add('player--active');
    activePalyer = 0;

});

