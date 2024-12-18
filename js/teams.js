<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Score Counter - Teams</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
    body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(135deg, #f0f0f0, #ffffff);
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        position: relative;
    }

    /* Header Section */
    header {
        background: linear-gradient(135deg, #1976d2, #1565c0);
        width: 100%;
        padding: 20px 0;
        position: relative;
    }

    .header-content {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        position: relative; 
    }

    /* Back button as an arrow */
    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
      user-select: none;
     /* Larger size for the button itself */
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-button:hover {
      background: rgba(255,255,255,0.2);
    }

    .back-icon {
      font-size: 1.5rem;
    }

    header h1 {
        margin: 0 0 10px 0;
        font-size: 2rem;
        font-weight: 600;
    }

    .top-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        align-items: center;
    }

    .winner-score {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 300;
    }

    .winner-score input {
        width: 60px;
        padding: 5px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
        text-align: center;
    }

    .top-actions button {
        background: #4caf50;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        transition: background 0.3s, transform 0.1s;
    }

    .top-actions button:hover {
        background: #43a047;
    }

    .top-actions button:active {
        transform: scale(0.98);
    }

    /* Main Content (Teams) */
    main#teamsContainer {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 600px;
        width: 100%;
        margin: 20px auto 40px auto;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .team-card {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: background-color 0.3s;
    }

    .team-card input[type="text"] {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 10px;
        border: none;
        border-bottom: 2px solid #ddd;
        padding: 5px;
        outline: none;
        width: 100%;
        max-width: 200px;
    }

    .team-card input[type="text"]:focus {
        border-bottom: 2px solid #1976d2;
    }

    .score-display {
        font-size: 2.5rem;
        margin: 10px 0;
        font-weight: 600;
    }

    .team-card button {
        background: #1976d2;
        border: none;
        color: #fff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin: 5px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        transition: background 0.3s, transform 0.1s;
    }

    .team-card button:hover {
        background: #1565c0;
    }

    .team-card button:active {
        transform: scale(0.95);
    }

    /* Responsive */
    @media (max-width: 600px) {
        header h1 {
            font-size: 1.8rem;
        }

        .score-display {
            font-size: 2rem;
        }

        .team-card {
            padding: 15px;
        }

        .team-card button {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
        }

        .back-button {
            font-size: 1.2rem;
            top: 15px;
            left: 15px;
        }
    }

    html, body {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        -webkit-touch-callout: none !important;
    }

    /* Modal overlay for Back warning */
    .modal-overlay {
      position: fixed;
      top:0; 
      left:0; 
      width:100%; 
      height:100%; 
      background: rgba(0,0,0,0.5);
      display:none; 
      align-items:center; 
      justify-content:center;
      z-index:9999;
    }

    .modal {
      background:#fff;
      padding:20px;
      border-radius:10px;
      text-align:center;
      max-width:300px;
      width:100%;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .modal h2 {
      margin-top:0;
      font-size:1.5rem;
      margin-bottom:20px;
    }

    .modal p {
      font-size:1rem;
      margin-bottom:20px;
    }

    .modal-buttons {
      display:flex;
      gap:10px;
      justify-content:center;
    }

    .modal-buttons button {
      padding:10px 20px;
      border:none;
      border-radius:5px;
      cursor:pointer;
      font-size:1rem;
      color:#fff;
      transition: background 0.3s;
    }

    .modal-buttons .go-back-btn {
      background:#d32f2f; /* red */
    }

    .modal-buttons .go-back-btn:hover {
      background:#b71c1c;
    }

    .modal-buttons .cancel-btn {
      background:#4caf50; /* green */
    }

    .modal-buttons .cancel-btn:hover {
      background:#388e3c;
    }

    .overlay {
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background: rgba(0,0,0,0.3);
      display:none;
      align-items:center;
      justify-content:center;
      z-index:9999;
    }

    .reset-circle {
      width:150px;
      height:150px;
      background:#fff;
      border-radius:50%;
      box-shadow:0 0 10px rgba(0,0,0,0.3);
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      animation: heartbeat 1s infinite;
      user-select: none;
      position: relative;
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    /* Blur the background when overlay is active */
    body.overlay-active main, 
    body.overlay-active header,
    body.overlay-active .top-actions,
    body.overlay-active .team-card {
      filter: blur(5px);
    }

    </style>
</head>
<body>
    <header>
      <button class="back-button" id="backBtn">
        <span class="back-icon">&#x2190;</span>
      </button> 
      <div class="header-content">
        <h1>Score Counter</h1>
        <div class="top-actions">
          <div class="winner-score">
            Winning score:
            <input type="number" id="winningScore" value="10">
          </div>
          <!-- Remove onclick="showResetCountdown()" from here -->
          <button id="resetBtn">Reset</button>
        </div>
      </div>
    </header>

    <main id="teamsContainer">
      <!-- Team cards will be generated by JS -->
    </main>

    <!-- Back warning Modal -->
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal">
        <h2>Warning</h2>
        <p>If you go back, the team names and scores will be reset. Are you sure?</p>
        <div class="modal-buttons">
          <button class="go-back-btn" id="confirmBackBtn">Go Back</button>
          <button class="cancel-btn" id="cancelBtn">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Overlay for reset hold -->
    <div class="overlay" id="overlay"></div>

    <script>
      const backBtn = document.getElementById('backBtn');
      const modalOverlay = document.getElementById('modalOverlay');
      const confirmBackBtn = document.getElementById('confirmBackBtn');
      const cancelBtn = document.getElementById('cancelBtn');
      const resetBtn = document.getElementById('resetBtn');
      const overlay = document.getElementById('overlay');

      let holding = false;
      let resetInterval;
      let resetTimeLeft;
      let resetCircle;

      backBtn.addEventListener('click', () => {
        // Show modal
        modalOverlay.style.display = 'flex';
      });

      cancelBtn.addEventListener('click', () => {
        // Hide modal
        modalOverlay.style.display = 'none';
      });

      confirmBackBtn.addEventListener('click', () => {
        goBack();
      });

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

      function resetGame() {
        teamsData.forEach(t => t.score = 0);
        updateScores();
      }

      function goBack() {
        window.location.href = 'index.html';
      }

      // از اینجا به بعد کد teams.js را اضافه کنید یا همینجا قرار دهید تا دسترسی به teamsData و updateScores داشته باشید.
      // ... (کد قبلی تعریف teamsData, updateScores, ...)

    </script>
    <script src="js/teams.js"></script>
</body>
</html>
