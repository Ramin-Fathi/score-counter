function getNumberOfTeams() {
  const urlParams = new URLSearchParams(window.location.search);
  const teams = urlParams.get('teams');
  return parseInt(teams, 10);
}

const numberOfTeams = getNumberOfTeams();

// Pastel colors for team cards
const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5'];

// Slightly darker tones for buttons (add: circle, subtract: square)
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

  const teamNameInput = document.createElement('input');
  teamNameInput.type = 'text';
  teamNameInput.value = team.name;
  teamNameInput.addEventListener('input', (e) => {
    teamsData[index].name = e.target.value;
  });

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'score-display';
  scoreDisplay.innerText = team.score;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '10px';
  buttonContainer.style.justifyContent = 'center';

  // Subtract button (square)
  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  styleButton(subtractButton, subtractButtonColors[index], false);

  // Add button (circle)
  const addButton = document.createElement('button');
  addButton.innerText = '+';
  styleButton(addButton, addButtonColors[index], true);

  // Add hold logic
  addButton.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startHold(addButton, scoreDisplay, () => {
      teamsData[index].score++;
      updateScores();
    });
  });

  subtractButton.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startHold(subtractButton, scoreDisplay, () => {
      if (teamsData[index].score > 0) {
        teamsData[index].score--;
        updateScores();
      }
    });
  });

  addButton.addEventListener('mouseup', stopHold);
  subtractButton.addEventListener('mouseup', stopHold);
  document.addEventListener('mouseleave', stopHold);

  buttonContainer.appendChild(subtractButton);
  buttonContainer.appendChild(addButton);

  teamCard.appendChild(teamNameInput);
  teamCard.appendChild(scoreDisplay);
  teamCard.appendChild(buttonContainer);

  teamsContainer.appendChild(teamCard);
});

let holdTimeout;
let animationInterval;
let holding = false;

/**
 * Styles the button with given color and shape.
 * @param {HTMLElement} btn 
 * @param {string} color 
 * @param {boolean} isCircle 
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
}

/**
 * Starts the hold process.
 * - User must hold for 2 seconds.
 * - During holding, score display and button "pulse".
 * - After 2s, callback executes once.
 * @param {HTMLElement} button 
 * @param {HTMLElement} scoreDisplay 
 * @param {Function} callback 
 */
function startHold(button, scoreDisplay, callback) {
  holding = true;

  // Animate score display (pulse)
  let scaleUp = true;
  scoreDisplay.style.transition = 'transform 0.3s ease';

  // Animate button as well
  button.style.transition = 'transform 0.3s ease';

  animationInterval = setInterval(() => {
    scoreDisplay.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    button.style.transform = scaleUp ? 'scale(1.2)' : 'scale(1)';
    scaleUp = !scaleUp;
  }, 300);

  // 2s timer
  holdTimeout = setTimeout(() => {
    if (holding) {
      callback();
    }
    cleanUpHold(scoreDisplay, button);
  }, 2000);
}

/**
 * Stops the hold process if mouse is released before 2s.
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
 * Cleans up after hold finishes.
 * @param {HTMLElement} scoreDisplay 
 * @param {HTMLElement} button 
 */
function cleanUpHold(scoreDisplay, button) {
  clearInterval(animationInterval);
  holding = false;
  resetAnimations();
}

/**
 * Reset animations for all score displays and buttons.
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
 * Updates scores and checks winner.
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
    const card = scoreDisplays[i].parentElement;
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
 * Reset game scores.
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
