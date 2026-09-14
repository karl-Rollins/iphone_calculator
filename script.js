/* eslint-disable no-unused-vars */
const screen = document.getElementById('display-screen')

// Function to show the clicked number on the screen
function appendNumber (number) {
  screen.innerText += number
}

// Function to clear the screen
function clearScreen () {
  screen.innerText = ''
}

// Function to evaluate the expression
function calculate () {
  try {
    let expression = screen.innerText
      .replace(/x/g, '*')
      .replace(/÷/g, '/');

    let result = eval(expression);

    screen.innerText = result;
  } catch (error) {
    screen.innerText = 'Error';
  }
}

document.getElementById('equal').addEventListener('click', calculate);

// Function to delete last value
function deleteNumber () {
    screen.innerText = screen.innerText.slice(0, -1);
}

document.getElementById('delete').addEventListener('click', deleteNumber);
