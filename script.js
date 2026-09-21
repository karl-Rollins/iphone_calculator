/* eslint-disable no-unused-vars */
const expressionScreen = document.getElementById('expression-screen')
const resultScreen = document.getElementById('result-screen')

let justCalculated = false
let lastCalculation = null

// Function to show the clicked number on the screen
function appendNumber (number) {
  if (justCalculated) {
    clearScreen()
    justCalculated = false
  }

  expressionScreen.innerText += number
}

window.appendNumber = appendNumber

// Function to clear the screen
function clearScreen () {
  expressionScreen.innerText = ''
  resultScreen.innerText = ''
}

window.clearScreen = clearScreen

// Function to evaluate the expression without eval or Function
function calculate() {
  try {
    const originalExpression = expressionScreen.innerText

    const expression = originalExpression
      .replace(/x/g, '*')
      .replace(/÷/g, '/')
      .replace(/(\d+(\.\d+)?)%/g, '($1/100)')

    const result = evaluateExpression(expression)

    lastCalculation = `${expressionScreen.innerText} = ${result}`

    resultScreen.innerText = result
    justCalculated = true
  } catch (error) {
    resultScreen.innerText = 'Error'
    justCalculated = true
  }
}

// Convert infix expression to postfix (RPN) and evaluate
function evaluateExpression (expr) {
  const outputQueue = []
  const operatorStack = []
  const operators = {
    '+': { precedence: 1, assoc: 'L' },
    '-': { precedence: 1, assoc: 'L' },
    '*': { precedence: 2, assoc: 'L' },
    '/': { precedence: 2, assoc: 'L' }
  }

  // Tokenize: numbers and operators
  const tokens = expr.match(/(\d+(\.\d+)?|\+|\*|\/|\(|\))/g)
  if (!tokens) throw new Error('Invalid expression')

  tokens.forEach(token => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token))
    } else if (operators[token]) {
      while (
        operatorStack.length &&
        operators[operatorStack[operatorStack.length - 1]] &&
        (
          (operators[token].assoc === 'L' &&
            operators[token].precedence <= operators[operatorStack[operatorStack.length - 1]].precedence)
        )
      ) {
        outputQueue.push(operatorStack.pop())
      }
      operatorStack.push(token)
    } else if (token === '(') {
      operatorStack.push(token)
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop())
      }
      operatorStack.pop()
    }
  })

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop())
  }

  // Evaluate postfix expression
  const stack = []
  outputQueue.forEach(token => {
    if (typeof token === 'number') {
      stack.push(token)
    } else {
      const b = stack.pop()
      const a = stack.pop()
      switch (token) {
        case '+': stack.push(a + b); break
        case '-': stack.push(a - b); break
        case '*': stack.push(a * b); break
        case '/': stack.push(a / b); break
      }
    }
  })

  if (stack.length !== 1) throw new Error('Invalid calculation')
  return stack[0]
}

document.getElementById('equal').addEventListener('click', calculate)

// Function to delete last value
function deleteNumber() {
  expressionScreen.innerText =
    expressionScreen.innerText.slice(0, -1)
}

document.getElementById('delete').addEventListener('click', deleteNumber)

// Function for plusminus
function togglePlusMinus () {
  if (expressionScreen.innerText) {
    if (expressionScreen.innerText.startsWith('-')) {
      expressionScreen.innerText = expressionScreen.innerText.slice(1)
    } else {
      expressionScreen.innerText =
        '-' + expressionScreen.innerText
    }
  }
}


document.getElementById('plusminus').addEventListener('click', togglePlusMinus)

//function to get history
const historyBtn = document.querySelector('.history')
const historyDropdown = document.getElementById('history-dropdown')

historyBtn.addEventListener('click', () => {
  if (lastCalculation) {
    historyDropdown.textContent = lastCalculation
  } else {
    historyDropdown.textContent = 'No history'
  }

  historyDropdown.classList.toggle('show')
})

