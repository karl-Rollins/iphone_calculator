/* eslint-disable no-unused-vars */
const expressionScreen = document.getElementById('expression-screen')
const resultScreen = document.getElementById('result-screen')

let justCalculated = false
const history = []

// Function to show the clicked number on the screen
function appendNumber (number) {
  if (justCalculated) {
    clearScreen()
    justCalculated = false
  }

  expressionScreen.innerText += number
}

window.appendNumber = appendNumber

function appendOperator (operator) {
  if (justCalculated) {
    expressionScreen.innerText = resultScreen.innerText
    justCalculated = false
  }

  expressionScreen.innerText += operator
}

window.appendOperator = appendOperator

// Function to clear the screen
function clearScreen () {
  expressionScreen.innerText = ''
  resultScreen.innerText = ''
  justCalculated = false
}

window.clearScreen = clearScreen

// Function to evaluate the expression without eval or Function
function calculate () {
  try {
    const originalExpression = expressionScreen.innerText

    // const expression = originalExpression
    //   .replace(/x/g, '*')
    //   .replace(/(\d+(\.\d+)?)%/g, '($1/100)')

    const expression = originalExpression
         .replace(/x/g, '*')
         .replace(
           /(\d+(?:\.\d+)?)([+-])(\d+(?:\.\d+)?)%/g,
           (_, base, op, percent) =>
             `${base}${op}(${base}*${percent}/100)`
          )
          .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')

    const result = evaluateExpression(expression)

    history.unshift(`${expressionScreen.innerText} = ${result}`)

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
    '/': { precedence: 2, assoc: 'L' },
    'u-': { precedence: 3, assoc: 'R' }
  }

  // Tokenize: numbers and operators
  const rawTokens = expr.match(
    /(\d+(?:\.\d+)?|\+|-|\*|\/|\(|\))/g
  )

  if (!rawTokens) {
    throw new Error('Invalid expression')
  }

  const tokens = []

  rawTokens.forEach((token, index) => {
    if (token === '-' &&
      (index === 0 ||
        rawTokens[index - 1] === '(' ||
        operators[rawTokens[index - 1]]
      )) {
      tokens.push('u-')
    } else {
      tokens.push(token)
    }
  })

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
    } else if (token === 'u-') {
      const value = stack.pop()

      if (value === undefined) {
        throw new Error('Invalid Calculation')
      }

      stack.push(-value)
    } else {
      const b = stack.pop()
      const a = stack.pop()

      if (a === undefined || b === undefined) {
        throw new Error('Invalid Calculation')
      }

      switch (token) {
        case '+':
          stack.push(a + b)
          break

        case '-':
          stack.push(a - b)
          break

        case '*':
          stack.push(a * b)
          break

        case '/':
          stack.push(a / b)
          break
      }
    }
  })

  if (stack.length !== 1) {
    throw new Error('Invalid Calculation')
  }

  const result = stack[0]

  if (!Number.isFinite(result)) {
    throw new Error('Invalid Calculation')
  }

  return result
}

document.getElementById('equal').addEventListener('click', calculate)

// Function to delete last value
// function deleteNumber () {
//   expressionScreen.innerText =
//     expressionScreen.innerText.slice(0, -1)
// }

// document.getElementById('delete').addEventListener('click', deleteNumber)

// Function for plusminus
function togglePlusMinus () {
  if (justCalculated) {
    expressionScreen.innerText = resultScreen.innerText
    resultScreen.innerText = ''
    justCalculated = false
  }

  const expr = expressionScreen.innerText

  if (!expr) {
    expressionScreen.innerText = '-'
    return
  }

  if (expr.startsWith('-')) {
    expressionScreen.innerText = expr.slice(1)
  } else {
    expressionScreen.innerText = '-' + expr
  }
}

document.getElementById('plusminus').addEventListener('click', togglePlusMinus)

// Function to get history
const historyBtn = document.querySelector('.history')
const historyDropdown = document.getElementById('history-dropdown')

historyBtn.addEventListener('click', () => {
  if (history.length > 10) {
    history.pop()
  }

  if (history.length) {
    historyDropdown.innerHTML = history
      .map(item => `<div>${item}</div>`)
      .join('')
  } else {
    historyDropdown.textContent = 'No history'
  }

  historyDropdown.classList.toggle('show')
})
