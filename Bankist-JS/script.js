'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-01-19T23:36:17.929Z',
    '2022-01-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale){
  const calcDayPassed = (date1, date2) => Math.round(Math.abs((date2 - date1) /(1000 *60 * 60 * 24)));

  const dayPassed = calcDayPassed(new Date(), date);

  if (dayPassed === 0) return 'TODAY';
  if (dayPassed === 1) return 'YESTERDAY';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

    // const day = `${date.getDay()}`.padStart(2, 0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency){
  const options ={
    style: 'currency',
    currency: currency,
  }
  return new Intl.NumberFormat(locale, options).format(value);
}


//tworzenie bilansu i sortowanie
let sorted = false
btnSort.addEventListener('click', (e) =>{
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})

const displayMovements = function (acc, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b)=> a - b) : acc.movements;



  movs.forEach((mov,i)=>{
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov,acc.locale, acc.currency);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
};


// suma

const calcDisplaybalance = function (acc){
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr
  }, 0);
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`
}



const calcDisplaySummary = function (acc){

  const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = formatCur(incomes,acc.locale, acc.currency);

  const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent =  formatCur(out,acc.locale, acc.currency);

  const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate) / 100)
      .filter(int => int >= 1)
      .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = formatCur(interest,acc.locale, acc.currency);
}



//tworznie inicjalow

const createUsernames = function (accs){
  accs.forEach((acc) => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(el =>  el[0])
            .join('');
      }
  )

};
createUsernames(accounts);

const updateUI = function (acc){

  //movements
  displayMovements(acc);
  //balance
  calcDisplaybalance(acc);
  //summary
  calcDisplaySummary(acc);
}

const startLogOutTimer = function (){
  const tick = function (){

    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;

    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent =`Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
};

let time = 120;
tick();
const timer = setInterval(tick,1000);
return timer;
};


//event handler
let currentAccount, timer;
btnLogin.addEventListener('click', (e)=>{
  e.preventDefault()
  currentAccount = accounts.find( acc => acc.username === inputLoginUsername.value);


  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // welcome message
    labelWelcome.textContent =` Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // create date
    const now = new Date();
    const options ={
      hour:'numeric',
      minute:'numeric',
      day: 'numeric',
      month:'numeric',
      year:'numeric',
      // weekday: 'long',
    }
    // const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
})


// transfer

btnTransfer.addEventListener('click', function (e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find( acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  if(amount > 0 && reciverAcc && currentAccount.balance >= amount && reciverAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();

  }
})
//loan

btnLoan.addEventListener('click', (e) =>{
  e.preventDefault();

  const amount =Math.floor(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)){
    // add movement
    setTimeout(()=>{
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    },4000)
  }
  clearInterval(timer);
  timer = startLogOutTimer();
  inputLoanAmount.value = '';
})


//close account

btnClose.addEventListener('click', (e) =>{
  e.preventDefault();

  const userName = inputCloseUsername.value;
  const userPin = Number(inputClosePin.value);
  if(userName === currentAccount.username && userPin === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
})


