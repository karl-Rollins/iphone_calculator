/* eslint-disable no-unused-vars */

// Function to show the clicked number on the screen
function appendNumber (number) {
  const screen = document.getElementById('display-screen')
  screen.innerText += number
}

// Function to clear the screen
function clearScreen () {
  document.getElementById('display-screen').innerText = ''
}
