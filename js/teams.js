function getNumberOfTeams() {
  const urlParams = new URLSearchParams(window.location.search);
  const teams = urlParams.get('teams');
  return parseInt(teams, 10);
}

const numberOfTeams = getNumberOfTeams();

// Colors for team cards (light pastel)
const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5'];

// Darker shades for buttons to match card tone
const teamButtonColors = ['#e0bbb7', '#b3d7b7', '#b9b6df', '#dbcea6'];

// Data for teams
let teamsData = [];
for (let i = 0; i < numberOfTeams; i++) {
  teamsData.push({
    name: `Team ${i+1}`,
    score: 0
  });
}

// Get container element
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

  // Button container to place + and - side by side
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '10px';

  // Subtract button (left)
  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  subtractButton.style.backgroundColor = teamButtonColors[index];
  subtractButton.style.border = 'none';
  subtractButton.style.color = '#fff';
  subtractButton.style.borderRadius = '8px';
  subtractButton.style.padding = '10px 16px';
  subtractButton.style.fontSize = '1rem';
  subtractButton.style.cursor = 'pointer';
  subtractButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  subtractButton.style.transition = 'background 0.3s, transform 0.1s';

  subtractButton.addEventListener('mousedown', () => {
    // When mouse down, after 2 seconds increase or decrease score continuously
    handleHold(subtractButton, () => {
      if (teamsData[index].score > 0) {
        teamsData[index].score--;
        animateScoreChange(scoreDisplay);
        updateScores();
      }
    });
  });

  subtractButton.addEventListener('mouseup', () => {
    // Stop hold when mouse up
    clearInterval(holdInterval);
  });

  // Add button (right)
  const addButton = document.createElement('button');
  addButton.innerText = '+';
  addButton.style.backgroundColor = teamButtonColors[index];
  addButton.style.border = 'none';
  addButton.style.color = '#fff';
  addButton.style.borderRadius = '8px';
  addButton.style.padding = '10px 16px';
  addButton.style.fontSize = '1rem';
  addButton.style.cursor = 'pointer';
  addButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  addButton.style.transition = 'background 0.3s, transform 0.1s';

  addButton.addEventListener('mousedown', () => {
    handleHold(addButton, () => {
      teamsData[index].score++;
      animateScoreChange(scoreDisplay);
      updateScores();
    });
  });

  addButton.addEventListener('mouseup', () => {
    clearInterval(holdInterval);
  });

  // Append buttons
  buttonContainer.appendChild(subtractButton);
  buttonContainer.appendChild(addButton);

  teamCard.appendChild(teamNameInput);
  teamCard.appendChild(scoreDisplay);
  teamCard.appendChild(buttonContainer);

  teamsContainer.appendChild(teamCard);
});

let holdInterval;

/**
 * Called when mouse is down on a button. It executes the callback immediately, 
 * then every 2 seconds until mouse is released.
 * @param {HTMLElement} button 
 * @param {Function} callback 
 */
function handleHold(button, callback) {
  // Execute once immediately
  callback();
  holdInterval = setInterval(callback, 2000);

  document.addEventListener('mouseup', () => {
    clearInterval(holdInterval);
  }, { once: true });
}

/**
 * Scales the score display to give visual feedback that score is changed.
 */
function animateScoreChange(scoreDisplay) {
  // Add scale class or inline style for animation
  scoreDisplay.style.transition = 'transform 0.2s ease';
  scoreDisplay.style.transform = 'scale(1.2)';
  
  setTimeout(() => {
    scoreDisplay.style.transform = 'scale(1)';
  }, 200);
}

/**
 * Updates scores and checks if there's a winner.
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
 * Resets the game to score 0.
 */
function resetGame() {
  teamsData.forEach(t => t.score = 0);
  updateScores();
}

/**
 * Goes back to the previous page.
 */
function goBack() {
  window.location.href = 'index.html';
}



// function getNumberOfTeams() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const teams = urlParams.get('teams');
//   return parseInt(teams, 10);
// }

// const numberOfTeams = getNumberOfTeams();

// // الان بر اساس تعداد تیم‌ها، UI را ایجاد می‌کنیم
// const teamsContainer = document.getElementById('teamsContainer');
// const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5']; // رنگ‌های پس‌زمینه برای تیم‌ها

// let teamsData = [];
// for (let i = 0; i < numberOfTeams; i++) {
//   teamsData.push({
//     name: `Team ${i+1}`,
//     score: 0
//   });
// }

// // حالا کارت‌های تیم رو می‌سازیم
// teamsData.forEach((team, index) => {
//   const teamCard = document.createElement('div');
//   teamCard.className = 'team-card';
//   teamCard.style.backgroundColor = teamColors[index]; // رنگ پس‌زمینه برای هر تیم

//   const teamNameInput = document.createElement('input');
//   teamNameInput.type = 'text';
//   teamNameInput.value = team.name;
//   teamNameInput.addEventListener('input', (e) => {
//     teamsData[index].name = e.target.value;
//   });

//   const scoreDisplay = document.createElement('div');
//   scoreDisplay.className = 'score-display';
//   scoreDisplay.innerText = team.score;

//   const addButton = document.createElement('button');
//   addButton.innerText = '+';
//   addButton.addEventListener('mousedown', () => {
//     // وقتی کلیک شد، با timeout امتیاز زیاد کنیم
//     handleHold(addButton, () => {
//       teamsData[index].score++;
//       updateScores();
//     });
//   });

//   const subtractButton = document.createElement('button');
//   subtractButton.innerText = '-';
//   subtractButton.addEventListener('mousedown', () => {
//     handleHold(subtractButton, () => {
//       if (teamsData[index].score > 0) {
//         teamsData[index].score--;
//         updateScores();
//       }
//     });
//   });

//   teamCard.appendChild(teamNameInput);
//   teamCard.appendChild(scoreDisplay);
//   teamCard.appendChild(addButton);
//   teamCard.appendChild(subtractButton);

//   teamsContainer.appendChild(teamCard);
// });

// let holdInterval;
// function handleHold(button, callback) {
//   // وقتی کلیک موس پایین هست، هر دو ثانیه یک بار callback اجرا بشه
//   callback(); // برای بار اول هم اجرا کن
//   holdInterval = setInterval(callback, 2000);

//   document.addEventListener('mouseup', () => {
//     clearInterval(holdInterval);
//   }, { once: true });
// }

// function updateScores() {
//   const scoreDisplays = document.querySelectorAll('.score-display');
//   const winningScore = parseInt(document.getElementById('winningScore').value, 10);

//   let winnerFound = false;
//   let maxScore = 0;
//   let winnerIndex = -1;

//   teamsData.forEach((t, i) => {
//     if (t.score > maxScore) {
//       maxScore = t.score;
//       winnerIndex = i;
//     }
//   });

//   // اگر امتیاز برنده شدن رد شد
//   if (maxScore >= winningScore) {
//     winnerFound = true;
//   }

//   teamsData.forEach((t, i) => {
//     scoreDisplays[i].innerText = t.score;
//     const card = scoreDisplays[i].parentElement;
//     if (winnerFound) {
//       if (i === winnerIndex) {
//         card.style.backgroundColor = 'green';
//       } else {
//         card.style.backgroundColor = 'red';
//       }
//     } else {
//       card.style.backgroundColor = teamColors[i]; // برگرداندن به رنگ اصلی
//     }
//   });
// }

// function resetGame() {
//   teamsData.forEach(t => t.score = 0);
//   updateScores();
// }

// function goBack() {
//   window.location.href = 'index.html';
// }
