let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

const currentOperandElement = document.getElementById('currentOperand');
const previousOperandElement = document.getElementById('previousOperand');
const historyList = document.getElementById('historyList');

updateDisplay();
renderHistory();

// Keyboard Support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (e.key === '+' || e.key === '-') appendOperator(e.key);
  if (e.key === '*') appendOperator('×');
  if (e.key === '/') appendOperator('÷');
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Escape') clearAll();
  if (e.key === 'Backspace') deleteLast();
});

function appendNumber(number) {
  if (shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }
  
  if (number === '.' && currentOperand.includes('.')) return;
  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentOperand === '') return;
  if (previousOperand !== '') {
    calculate();
  }
  operation = op;
  previousOperand = currentOperand;
  currentOperand = '';
  updateDisplay();
}

function calculate() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  
  if (isNaN(prev) || isNaN(current)) return;
  
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '×':
      computation = prev * current;
      break;
    case '÷':
      if (current === 0) {
        alert('Cannot divide by zero!');
        clearAll();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }
  
  // Save to history
  const historyItem = `${previousOperand} ${operation} ${currentOperand} = ${computation}`;
  history.unshift(historyItem);
  if (history.length > 10) history.pop(); // Keep last 10
  localStorage.setItem('calcHistory', JSON.stringify(history));
  renderHistory();
  
  currentOperand = computation.toString();
  operation = undefined;
  previousOperand = '';
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = undefined;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetScreen) return;
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === '') currentOperand = '0';
  updateDisplay();
}

function updateDisplay() {
  currentOperandElement.innerText = currentOperand;
  if (operation != null) {
    previousOperandElement.innerText = `${previousOperand} ${operation}`;
  } else {
    previousOperandElement.innerText = '';
  }
}

function renderHistory() {
  historyList.innerHTML = '';
  if (history.length === 0) {
    historyList.innerHTML = '<p style="color:#999; text-align:center;">No history yet</p>';
    return;
  }
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerText = item;
    historyList.appendChild(div);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem('calcHistory');
  renderHistory();
}