function getNumberOfTeams() {
  const urlParams = new URLSearchParams(window.location.search);
  const teams = urlParams.get('teams');
  return parseInt(teams, 10);
}

const numberOfTeams = getNumberOfTeams();

// الان بر اساس تعداد تیم‌ها، UI را ایجاد می‌کنیم
const teamsContainer = document.getElementById('teamsContainer');
const teamColors = ['#f2d7d5', '#d5f2d7', '#d7d5f2', '#f2ecd5']; // رنگ‌های پس‌زمینه برای تیم‌ها

let teamsData = [];
for (let i = 0; i < numberOfTeams; i++) {
  teamsData.push({
    name: `Team ${i+1}`,
    score: 0
  });
}

// حالا کارت‌های تیم رو می‌سازیم
teamsData.forEach((team, index) => {
  const teamCard = document.createElement('div');
  teamCard.className = 'team-card';
  teamCard.style.backgroundColor = teamColors[index]; // رنگ پس‌زمینه برای هر تیم

  const teamNameInput = document.createElement('input');
  teamNameInput.type = 'text';
  teamNameInput.value = team.name;
  teamNameInput.addEventListener('input', (e) => {
    teamsData[index].name = e.target.value;
  });

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'score-display';
  scoreDisplay.innerText = team.score;

  const addButton = document.createElement('button');
  addButton.innerText = '+';
  addButton.addEventListener('mousedown', () => {
    // وقتی کلیک شد، با timeout امتیاز زیاد کنیم
    handleHold(addButton, () => {
      teamsData[index].score++;
      updateScores();
    });
  });

  const subtractButton = document.createElement('button');
  subtractButton.innerText = '-';
  subtractButton.addEventListener('mousedown', () => {
    handleHold(subtractButton, () => {
      if (teamsData[index].score > 0) {
        teamsData[index].score--;
        updateScores();
      }
    });
  });

  teamCard.appendChild(teamNameInput);
  teamCard.appendChild(scoreDisplay);
  teamCard.appendChild(addButton);
  teamCard.appendChild(subtractButton);

  teamsContainer.appendChild(teamCard);
});

let holdInterval;
function handleHold(button, callback) {
  // وقتی کلیک موس پایین هست، هر دو ثانیه یک بار callback اجرا بشه
  callback(); // برای بار اول هم اجرا کن
  holdInterval = setInterval(callback, 2000);

  document.addEventListener('mouseup', () => {
    clearInterval(holdInterval);
  }, { once: true });
}

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

  // اگر امتیاز برنده شدن رد شد
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
      card.style.backgroundColor = teamColors[i]; // برگرداندن به رنگ اصلی
    }
  });
}

function resetGame() {
  teamsData.forEach(t => t.score = 0);
  updateScores();
}

function goBack() {
  window.location.href = 'index.html';
}
