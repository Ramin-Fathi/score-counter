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

// Teams data
let teamsData = [];
for (let i = 0; i < numberOfTeams; i++) {
  teamsData.push({
    name: `Team ${i+1}`,
    score: 0
  });
}

const teamsContainer = document.getElementById('teamsContainer');

// Create team cards
teamsData.forEach((team, index) => {
  const teamCard = document.createElement('div');
  teamCard.className = 'team-card';
  teamCard.style.backgroundColor = teamColors[index];

  // Team name input
  const teamNameInput = document.createElement('input');
  teamNameInput.type = 'text';
  teamNameInput.value = team.name;
  teamNameInput.addEventListener('input', (e) => {
    teamsData[index].name = e.target.value;
  });

  // Score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'score-display';
  scoreDisplay.innerText = team.score;

  // Button container: add & subtract side by side
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '10px';
  buttonContainer.style.justifyContent = 'center';

  // Subtract button (square)
  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  subtractButton.style.backgroundColor = subtractButtonColors[index];
  subtractButton.style.border = 'none';
  subtractButton.style.color = '#fff';
  subtractButton.style.borderRadius = '4px'; // square with slight rounding
  subtractButton.style.padding = '10px 16px';
  subtractButton.style.fontSize = '1rem';
  subtractButton.style.cursor = 'pointer';
  subtractButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  subtractButton.style.transition = 'background 0.3s, transform 0.1s';

  // Add button (circle)
  const addButton = document.createElement('button');
  addButton.innerText = '+';
  addButton.style.backgroundColor = addButtonColors[index];
  addButton.style.border = 'none';
  addButton.style.color = '#fff';
  addButton.style.borderRadius = '50%';
  addButton.style.padding = '10px 16px';
  addButton.style.fontSize = '1rem';
  addButton.style.cursor = 'pointer';
  addButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  addButton.style.transition = 'background 0.3s, transform 0.1s';

  // Add hold logic (2 seconds hold, then apply score change once)
  addButton.addEventListener('mousedown', () => {
    startHold(addButton, scoreDisplay, () => {
      // After 2s hold, increment score
      teamsData[index].score++;
      updateScores();
    });
  });

  subtractButton.addEventListener('mousedown', () => {
    startHold(subtractButton, scoreDisplay, () => {
      // After 2s hold, decrement score
      if (teamsData[index].score > 0) {
        teamsData[index].score--;
        updateScores();
      }
    });
  });

  // On mouseup/cancel, we stop the hold
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

let holdTimeout;  // For 2s delay
let animationInterval; // For "heartbeat" animation
let holding = false;  // To track if currently holding

/**
 * Starts the hold process. 
 * - User must hold for 2 seconds.
 * - During holding, score display "pulses" (scale up/down).
 * - After 2 seconds, callback is executed once.
 * @param {HTMLElement} button 
 * @param {HTMLElement} scoreDisplay 
 * @param {Function} callback 
 */
function startHold(button, scoreDisplay, callback) {
  holding = true;

  // Start animation (heartbeat)
  let scaleUp = true;
  scoreDisplay.style.transition = 'transform 0.3s ease';
  
  animationInterval = setInterval(() => {
    if (scaleUp) {
      scoreDisplay.style.transform = 'scale(1.2)';
    } else {
      scoreDisplay.style.transform = 'scale(1)';
    }
    scaleUp = !scaleUp;
  }, 300);

  // Start 2s timer
  holdTimeout = setTimeout(() => {
    if (holding) {
      // 2 seconds passed, apply callback
      callback();
    }
    // Stop animation and reset scale
    clearInterval(animationInterval);
    scoreDisplay.style.transform = 'scale(1)';
    holding = false;
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

    // Reset scale
    const scoreDisplays = document.querySelectorAll('.score-display');
    scoreDisplays.forEach(sd => {
      sd.style.transform = 'scale(1)';
    });
  }
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

  // Find max score
  teamsData.forEach((t, i) => {
    if (t.score > maxScore) {
      maxScore = t.score;
      winnerIndex = i;
    }
  });

  // Check if we have a winner
  if (maxScore >= winningScore) {
    winnerFound = true;
  }

  // Update UI
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
 * Reset game scores to 0.
 */
function resetGame() {
  teamsData.forEach(t => t.score = 0);
  updateScores();
}

/**
 * Go back to the previous page.
 */
function goBack() {
  window.location.href = 'index.html';
}
