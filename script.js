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
    const expression = screen.innerText
      .replace(/x/g, '*')
      .replace(/÷/g, '/')
      // Replace percentages: "50%" → "(50/100)"
      .replace(/(\d+(\.\d+)?)%/g, '($1/100)')

    // Use Function constructor instead of eval for safety
    const result = Function('"use strict"; return (' + expression + ')')()

    screen.innerText = result
  } catch (error) {
    screen.innerText = 'Error'
  }
}

document.getElementById('equal').addEventListener('click', calculate)

// Function to delete last value
function deleteNumber () {
  screen.innerText = screen.innerText.slice(0, -1)
}

document.getElementById('delete').addEventListener('click', deleteNumber)

// Function for plusminus
function togglePlusMinus () {
  if (screen.innerText) {
    if (screen.innerText.startsWith('-')) {
      screen.innerText = screen.innerText.slice(1)
    } else {
      screen.innerText = '-' + screen.innerText
    }
  }
}

document.getElementById('plusminus').addEventListener('click', togglePlusMinus)
