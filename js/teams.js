function getNumberOfTeams() {
  const urlParams = new URLSearchParams(window.location.search);
  const teams = urlParams.get('teams');
  return parseInt(teams, 10);
}

const numberOfTeams = getNumberOfTeams();

const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5'];
const addButtonColors = ['#d2605e', '#5fa864', '#6a60d2', '#c6b24a'];
const subtractButtonColors = ['#e28c89', '#a8e1ab', '#b5aaf2', '#e2d597'];

let teamsData = [];
for (let i = 0; i < numberOfTeams; i++) {
  teamsData.push({ name: `Team ${i+1}`, score: 0 });
}

const teamsContainer = document.getElementById('teamsContainer');

// Create Teams UI
teamsData.forEach((team, index) => {
  const teamCard = document.createElement('div');
  teamCard.className = 'team-card';
  teamCard.style.backgroundColor = teamColors[index];

  const teamNameInput = document.createElement('input');
  teamNameInput.type = 'text';
  teamNameInput.value = team.name;
  teamNameInput.style.userSelect = 'auto';
  
  teamNameInput.addEventListener('input', (e) => {
    teamsData[index].name = e.target.value;
  });

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'score-display';
  scoreDisplay.innerText = team.score;
  scoreDisplay.style.userSelect = 'none';

  const rowContainer = document.createElement('div');
  rowContainer.style.display = 'flex';
  rowContainer.style.alignItems = 'center';
  rowContainer.style.justifyContent = 'space-between';
  rowContainer.style.width = '100%';
  rowContainer.style.gap = '20px';
  rowContainer.style.marginTop = '10px';

  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  styleButton(subtractButton, subtractButtonColors[index], true); 
  subtractButton.style.fontSize = '2rem';

  const addButton = document.createElement('button');
  addButton.innerText = '+';
  styleButton(addButton, addButtonColors[index], true);
  addButton.style.fontSize = '2rem';

  addButton.addEventListener('mousedown', (e) => { e.preventDefault(); startHold(addButton, scoreDisplay, () => {
    teamsData[index].score++;
    updateScores();
  }); });
  subtractButton.addEventListener('mousedown', (e) => { e.preventDefault(); startHold(subtractButton, scoreDisplay, () => {
    if (teamsData[index].score > 0) {
      teamsData[index].score--;
      updateScores();
    }
  }); });

  addButton.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(addButton, scoreDisplay, () => {
    teamsData[index].score++;
    updateScores();
  }); });
  subtractButton.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(subtractButton, scoreDisplay, () => {
    if (teamsData[index].score > 0) {
      teamsData[index].score--;
      updateScores();
    }
  }); });

  addButton.addEventListener('mouseup', stopHold);
  subtractButton.addEventListener('mouseup', stopHold);
  addButton.addEventListener('touchend', stopHold);
  subtractButton.addEventListener('touchend', stopHold);
  document.addEventListener('mouseleave', stopHold);

  rowContainer.appendChild(subtractButton);
  rowContainer.appendChild(scoreDisplay);
  rowContainer.appendChild(addButton);

  teamCard.appendChild(teamNameInput);
  teamCard.appendChild(rowContainer);

  teamsContainer.appendChild(teamCard);
});

let holdTimeout;
let animationInterval;
let holding = false;

// Handle Reset Button (long press)
const resetBtn = document.querySelector('button[onclick="showResetCountdown()"]');
resetBtn.removeAttribute('onclick'); // Remove the direct onclick

resetBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  startResetHold();
});
resetBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startResetHold();
});

resetBtn.addEventListener('mouseup', stopResetHold);
resetBtn.addEventListener('touchend', stopResetHold);

// Variables for reset hold
let resetInterval;
let resetTimeLeft;
let overlay = document.getElementById('overlay');
let resetCircle;

function startResetHold() {
  holding = true;
  resetTimeLeft = 3;
  
  // Show overlay and circle
  document.body.classList.add('overlay-active');
  overlay.style.display = 'flex';

  resetCircle = document.createElement('div');
  resetCircle.className = 'reset-circle';

  const text = document.createElement('div');
  text.style.fontSize = '1.5rem';
  text.style.fontWeight = '600';
  text.style.marginBottom = '10px';
  text.innerText = 'Reset';

  const countdown = document.createElement('div');
  countdown.style.fontSize = '2rem';
  countdown.style.fontWeight = 'bold';
  countdown.innerText = resetTimeLeft;

  resetCircle.appendChild(text);
  resetCircle.appendChild(countdown);
  overlay.appendChild(resetCircle);

  resetInterval = setInterval(() => {
    if (!holding) return; // If user released early
    resetTimeLeft--;
    if (resetTimeLeft <= 0) {
      clearInterval(resetInterval);
      finishReset();
    } else {
      countdown.innerText = resetTimeLeft;
    }
  }, 1000);
}

function stopResetHold() {
  if (holding) {
    holding = false;
    clearInterval(resetInterval);
    hideResetOverlay();
  }
}

function finishReset() {
  holding = false;
  hideResetOverlay();
  resetGame();
}

function hideResetOverlay() {
  if (resetCircle && resetCircle.parentNode) {
    resetCircle.parentNode.removeChild(resetCircle);
  }
  overlay.style.display = 'none';
  document.body.classList.remove('overlay-active');
}

/**
 * Styles a button
 */
function styleButton(btn, color, isCircle) {
  btn.style.backgroundColor = color;
  btn.style.border = 'none';
  btn.style.color = '#fff';
  btn.style.borderRadius = isCircle ? '50%' : '4px';
  btn.style.padding = '10px 16px';
  btn.style.fontSize = '1rem';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  btn.style.transition = 'background 0.3s, transform 0.1s';
  btn.style.userSelect = 'none';
  btn.style.webkitUserSelect = 'none';
  btn.style.MozUserSelect = 'none';
  btn.style.webkitTouchCallout = 'none';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
}

/**
 * Start hold process for score buttons
 */
function startHold(button, scoreDisplay, callback) {
  holding = true;
  let scaleUp = true;
  scoreDisplay.style.transition = 'transform 0.3s ease';
  button.style.transition = 'transform 0.3s ease';

  animationInterval = setInterval(() => {
    if (!holding) return;
    scoreDisplay.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    button.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    scaleUp = !scaleUp;
  }, 300);

  holdTimeout = setTimeout(() => {
    if (holding) {
      callback();
    }
    cleanUpHold(scoreDisplay, button);
  }, 1500);
}

/**
 * Stop hold if released early for score buttons
 */
function stopHold() {
  if (holding && !resetCircle) {
    holding = false;
    clearTimeout(holdTimeout);
    clearInterval(animationInterval);
    resetAnimations();
  }
}

/**
 * Clean up after hold finishes for score buttons
 */
function cleanUpHold(scoreDisplay, button) {
  clearInterval(animationInterval);
  holding = false;
  resetAnimations();
}

/**
 * Reset animations
 */
function resetAnimations() {
  const scoreDisplays = document.querySelectorAll('.score-display');
  scoreDisplays.forEach(sd => sd.style.transform = 'scale(1)');

  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(b => b.style.transform = 'scale(1)');
}

/**
 * Update scores and check winner.
 */
function updateScores() {
  const scoreDisplays = document.querySelectorAll('.score-display');
  const winningScore = parseInt(document.getElementById('winningScore').value, 10);

  let winnerFound = false;
  let maxScore = 0;
  let winnerIndex = -1;

  teamsData.forEach((t, i) => {
    if (t.score > maxScore) {
      maxScore = t.score;
      winnerIndex = i;
    }
  });

  if (maxScore >= winningScore) {
    winnerFound = true;
  }

  teamsData.forEach((t, i) => {
    scoreDisplays[i].innerText = t.score;
    const card = scoreDisplays[i].parentElement.parentElement;
    if (winnerFound) {
      card.style.backgroundColor = (i === winnerIndex) ? 'green' : 'red';
    } else {
      card.style.backgroundColor = teamColors[i];
    }
  });
}

/**
 * Reset the game scores.
 */
function resetGame() {
  teamsData.forEach(t => t.score = 0);
  updateScores();
}

/**
 * Go back to previous page.
 */
function goBack() {
  window.location.href = 'index.html';
}
