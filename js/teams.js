document.onselectstart = function(){return false;};
document.oncontextmenu = function(){return false;};

function getNumberOfTeams() {
  const urlParams = new URLSearchParams(window.location.search);
  const teams = urlParams.get('teams');
  return parseInt(teams, 10);
}

const numberOfTeams = getNumberOfTeams();

// Pastel colors for team cards
const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5'];

// Slightly darker tones for buttons
const addButtonColors = ['#e28c89', '#a8e1ab', '#b5aaf2', '#e2d597'];
const subtractButtonColors = ['#c77974', '#8fd693', '#9f92f2', '#d2c57b'];

let teamsData = [];
for (let i = 0; i < numberOfTeams; i++) {
  teamsData.push({
    name: `Team ${i+1}`,
    score: 0
  });
}

const teamsContainer = document.getElementById('teamsContainer');

teamsData.forEach((team, index) => {
  const teamCard = document.createElement('div');
  teamCard.className = 'team-card';
  teamCard.style.backgroundColor = teamColors[index];
  teamCard.style.userSelect = 'none';
  teamCard.style.webkitUserSelect = 'none';
  teamCard.style.MozUserSelect = 'none';
  teamCard.style.webkitTouchCallout = 'none';

  const teamNameInput = document.createElement('input');
  teamNameInput.type = 'text';
  teamNameInput.value = team.name;
  teamNameInput.style.userSelect = 'none';
  teamNameInput.style.webkitUserSelect = 'none';
  teamNameInput.style.MozUserSelect = 'none';
  teamNameInput.style.webkitTouchCallout = 'none';
  teamNameInput.addEventListener('input', (e) => {
    teamsData[index].name = e.target.value;
  });

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'score-display';
  scoreDisplay.innerText = team.score;
  scoreDisplay.style.userSelect = 'none';

  // Create a row container to hold subtract button, score, and add button in one line
  const rowContainer = document.createElement('div');
  rowContainer.style.display = 'flex';
  rowContainer.style.alignItems = 'center';
  rowContainer.style.justifyContent = 'space-between';
  rowContainer.style.width = '100%';
  rowContainer.style.gap = '20px'; // space between elements
  rowContainer.style.marginTop = '10px';

  // Subtract button (circle)
  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  styleButton(subtractButton, subtractButtonColors[index], true); // true for circle
  subtractButton.style.fontSize = '2rem';

  // Add button (circle)
  const addButton = document.createElement('button');
  addButton.innerText = '+';
  styleButton(addButton, addButtonColors[index], true);
  addButton.style.fontSize = '2rem';

  // Add events with preventDefault to avoid highlighting/copy
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

  // Touch events for mobile
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

/**
 * Style the button with given color and shape (circle if isCircle is true).
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
}

/**
 * Start hold process.
 * - 2s hold required.
 * - Pulse animation on score and button.
 * - After 2s, callback executed.
 */
function startHold(button, scoreDisplay, callback) {
  holding = true;

  let scaleUp = true;
  scoreDisplay.style.transition = 'transform 0.3s ease';
  button.style.transition = 'transform 0.3s ease';

  animationInterval = setInterval(() => {
    scoreDisplay.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    button.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    scaleUp = !scaleUp;
  }, 300);

  holdTimeout = setTimeout(() => {
    if (holding) {
      callback();
    }
    cleanUpHold(scoreDisplay, button);
  }, 2000);
}

/**
 * Stop hold if released early.
 */
function stopHold() {
  if (holding) {
    holding = false;
    clearTimeout(holdTimeout);
    clearInterval(animationInterval);
    resetAnimations();
  }
}

/**
 * Clean up after hold finishes.
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
  scoreDisplays.forEach(sd => {
    sd.style.transform = 'scale(1)';
  });

  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(b => {
    b.style.transform = 'scale(1)';
  });
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
    // parentElement twice because now scoreDisplays are inside rowContainer which is inside team-card.
    if (winnerFound) {
      if (i === winnerIndex) {
        card.style.backgroundColor = 'green';
      } else {
        card.style.backgroundColor = 'red';
      }
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
