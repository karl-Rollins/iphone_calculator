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
      .replace(/÷/g, '/')
      // Replace percentages: "50%" → "(50/100)"
      .replace(/(\d+(\.\d+)?)%/g, '($1/100)')

    // Use a safe parser with new Function avoided
    const result = safeEvaluate(expression)

    screen.innerText = result
    justCalculated = true
  } catch (error) {
    screen.innerText = 'Error'
    justCalculated = true
  }
}

// Very basic safe evaluator (supports +, -, *, /, parentheses)
function safeEvaluate(expr) {
  // Only allow digits, operators, parentheses, decimal points, and spaces
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error('Invalid characters in expression')
  }
  return (function () {
    return eval(expr) // still uses eval, but now guarded by regex
  }) ()
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
