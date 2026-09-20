/* ==========================================================================
   OUR SECRET - LUDO GAME SCRIPT
   Multiplayer (PeerJS) & Offline Pass-and-Play Ludo for Shakibul & Jannatul
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Sound Synthesizer (Web Audio API)
     -------------------------------------------------------------------------- */
  let soundMuted = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (soundMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'roll') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'move') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'capture') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.25);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'win') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.connect(g);
          g.connect(audioCtx.destination);
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + idx * 0.12);
          g.gain.setValueAtTime(0.3, now + idx * 0.12);
          g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.2);
          o.start(now + idx * 0.12);
          o.stop(now + idx * 0.12 + 0.2);
        });
      }
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  }

  /* --------------------------------------------------------------------------
     2. Board Mapping & Safe Spots
     -------------------------------------------------------------------------- */
  // Safe main path indices
  const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

  // Map main path index (0-51) to 1-based (row, col) on 15x15 board grid
  const MAIN_PATH_COORDS = [
    [7,2], [7,3], [7,4], [7,5], [7,6], [6,7], [5,7], [4,7], [3,7], [2,7], [1,7], [1,8], [1,9], // 0-12
    [2,9], [3,9], [4,9], [5,9], [6,9], [7,10], [7,11], [7,12], [7,13], [7,14], [7,15], [8,15], // 13-24
    [9,15], [9,14], [9,13], [9,12], [9,11], [9,10], [10,9], [11,9], [12,9], [13,9], [14,9], [15,9], // 25-36
    [15,8], [15,7], [14,7], [13,7], [12,7], [11,7], [10,7], [9,6], [9,5], [9,4], [9,3], [9,2], [9,1], [8,1], [7,1] // 37-51
  ];

  // Home stretch coordinates for Red (steps 51-55) & Yellow (steps 51-55)
  const HOME_STRETCH = {
    red: [[8,2], [8,3], [8,4], [8,5], [8,6]],
    yellow: [[8,14], [8,13], [8,12], [8,11], [8,10]]
  };

  // Yard token home spot coordinates
  const YARD_SPOTS = {
    red: [[2,2], [2,5], [5,2], [5,5]],
    yellow: [[11,11], [11,14], [14,11], [14,14]]
  };

  function getTileCoord(player, steps, tokenIdx) {
    if (steps === -1) {
      return YARD_SPOTS[player][tokenIdx];
    }
    if (steps === 56) {
      return [8, 8]; // Center home
    }
    if (steps >= 51 && steps <= 55) {
      return HOME_STRETCH[player][steps - 51];
    }
    // Main path index calculation
    const offset = player === 'red' ? 0 : 26;
    const pathIdx = (steps + offset) % 52;
    return MAIN_PATH_COORDS[pathIdx];
  }

  function getMainPathIdx(player, steps) {
    if (steps >= 0 && steps <= 50) {
      const offset = player === 'red' ? 0 : 26;
      return (steps + offset) % 52;
    }
    return -1;
  }

  /* --------------------------------------------------------------------------
     3. Game State
     -------------------------------------------------------------------------- */
  let gameState = {
    mode: 'pass', // 'pass', 'host', 'guest'
    turn: 'red', // 'red' or 'yellow'
    diceValue: null,
    rolled: false,
    extraTurn: false,
    winner: null,
    tokens: {
      red: [-1, -1, -1, -1],
      yellow: [-1, -1, -1, -1]
    }
  };

  let myRole = 'both'; // 'both' for pass-and-play, 'red' for host, 'yellow' for guest
  let peer = null;
  let peerConn = null;
  let roomCode = '';

  /* --------------------------------------------------------------------------
     4. DOM Elements
     -------------------------------------------------------------------------- */
  const modeSelection = document.getElementById('modeSelection');
  const gameSection = document.getElementById('gameSection');
  const roomDetails = document.getElementById('roomDetails');
  const createdCodeDisplay = document.getElementById('createdCodeDisplay');
  const roomStatusText = document.getElementById('roomStatusText');
  const roomCodeInput = document.getElementById('roomCodeInput');

  const btnPassAndPlay = document.getElementById('btnPassAndPlay');
  const btnCreateRoom = document.getElementById('btnCreateRoom');
  const btnJoinRoom = document.getElementById('btnJoinRoom');
  const btnCopyCode = document.getElementById('btnCopyCode');
  const btnChangeMode = document.getElementById('btnChangeMode');

  const ludoBoard = document.getElementById('ludoBoard');
  const diceCube = document.getElementById('diceCube');
  const btnRollDice = document.getElementById('btnRollDice');

  const badgeRed = document.getElementById('badgeRed');
  const badgeYellow = document.getElementById('badgeYellow');
  const redScore = document.getElementById('redScore');
  const yellowScore = document.getElementById('yellowScore');
  const turnText = document.getElementById('turnText');
  const turnSubtext = document.getElementById('turnSubtext');
  const connectionTag = document.getElementById('connectionTag');
  const connectionText = document.getElementById('connectionText');

  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  const errorModal = document.getElementById('errorModal');
  const errorModalTitle = document.getElementById('errorModalTitle');
  const errorModalMsg = document.getElementById('errorModalMsg');
  const btnRetryConnection = document.getElementById('btnRetryConnection');
  const btnErrorBack = document.getElementById('btnErrorBack');

  const winModal = document.getElementById('winModal');
  const winTitle = document.getElementById('winTitle');
  const winLoveMsg = document.getElementById('winLoveMsg');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const btnWinBack = document.getElementById('btnWinBack');

  /* --------------------------------------------------------------------------
     5. Build Ludo Board DOM Grid
     -------------------------------------------------------------------------- */
  function buildBoardGrid() {
    ludoBoard.innerHTML = '';

    // Create 15x15 grid cells
    for (let r = 1; r <= 15; r++) {
      for (let c = 1; c <= 15; c++) {
        // Yard structures
        if (r <= 6 && c <= 6) {
          if (r === 1 && c === 1) {
            const yard = document.createElement('div');
            yard.className = 'yard yard-red';
            yard.innerHTML = `<div class="yard-inner">
              <div class="home-spot" data-yard="red-0"></div>
              <div class="home-spot" data-yard="red-1"></div>
              <div class="home-spot" data-yard="red-2"></div>
              <div class="home-spot" data-yard="red-3"></div>
            </div>`;
            ludoBoard.appendChild(yard);
          }
          continue;
        }
        if (r <= 6 && c >= 10) {
          if (r === 1 && c === 10) {
            const yard = document.createElement('div');
            yard.className = 'yard yard-green';
            yard.innerHTML = `<div class="yard-inner">
              <div class="home-spot"></div><div class="home-spot"></div>
              <div class="home-spot"></div><div class="home-spot"></div>
            </div>`;
            ludoBoard.appendChild(yard);
          }
          continue;
        }
        if (r >= 10 && c <= 6) {
          if (r === 10 && c === 1) {
            const yard = document.createElement('div');
            yard.className = 'yard yard-blue';
            yard.innerHTML = `<div class="yard-inner">
              <div class="home-spot"></div><div class="home-spot"></div>
              <div class="home-spot"></div><div class="home-spot"></div>
            </div>`;
            ludoBoard.appendChild(yard);
          }
          continue;
        }
        if (r >= 10 && c >= 10) {
          if (r === 10 && c === 10) {
            const yard = document.createElement('div');
            yard.className = 'yard yard-yellow';
            yard.innerHTML = `<div class="yard-inner">
              <div class="home-spot" data-yard="yellow-0"></div>
              <div class="home-spot" data-yard="yellow-1"></div>
              <div class="home-spot" data-yard="yellow-2"></div>
              <div class="home-spot" data-yard="yellow-3"></div>
            </div>`;
            ludoBoard.appendChild(yard);
          }
          continue;
        }

        // Center Home
        if (r >= 7 && r <= 9 && c >= 7 && c <= 9) {
          if (r === 7 && c === 7) {
            const center = document.createElement('div');
            center.className = 'center-home';
            center.setAttribute('data-cell', '8-8');
            center.innerHTML = `
              <div class="center-home-triangle tri-red"></div>
              <div class="center-home-triangle tri-yellow"></div>
              <div class="center-home-heart">💖</div>
            `;
            ludoBoard.appendChild(center);
          }
          continue;
        }

        // Standard path cell
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.gridRow = r;
        cell.style.gridColumn = c;
        cell.setAttribute('data-cell', `${r}-${c}`);

        // Red Path
        if (r === 7 && c === 2) cell.classList.add('path-red', 'safe-cell');
        if (r === 8 && c >= 2 && c <= 6) cell.classList.add('path-red');

        // Yellow Path
        if (r === 9 && c === 14) cell.classList.add('path-yellow', 'safe-cell');
        if (r === 8 && c >= 10 && c <= 14) cell.classList.add('path-yellow');

        // Safe star cells
        if ((r === 3 && c === 7) || (r === 2 && c === 9) || (r === 7 && c === 13) ||
            (r === 13 && c === 9) || (r === 14 && c === 7) || (r === 9 && c === 3)) {
          cell.classList.add('safe-cell');
        }

        ludoBoard.appendChild(cell);
      }
    }
  }

  /* --------------------------------------------------------------------------
     6. Render Game Board & Tokens
     -------------------------------------------------------------------------- */
  function renderBoard() {
    // Clear all existing tokens
    document.querySelectorAll('.token').forEach(el => el.remove());

    // Count score
    const redHomeCount = gameState.tokens.red.filter(s => s === 56).length;
    const yellowHomeCount = gameState.tokens.yellow.filter(s => s === 56).length;

    redScore.textContent = `${redHomeCount}/4`;
    yellowScore.textContent = `${yellowHomeCount}/4`;

    // Active player turn styling
    if (gameState.turn === 'red') {
      badgeRed.classList.add('active-turn');
      badgeYellow.classList.remove('active-turn');
      turnText.textContent = "Shakibul's Turn ❤️";
    } else {
      badgeYellow.classList.add('active-turn');
      badgeRed.classList.remove('active-turn');
      turnText.textContent = "Jannatul's Turn 💛";
    }

    if (gameState.rolled) {
      turnSubtext.textContent = `Rolled a ${gameState.diceValue}! Select a token to move.`;
    } else {
      turnSubtext.textContent = 'Roll the dice!';
    }

    // Render tokens for both players
    ['red', 'yellow'].forEach(player => {
      gameState.tokens[player].forEach((steps, tokenIdx) => {
        const [r, c] = getTileCoord(player, steps, tokenIdx);
        let targetCell = null;

        if (steps === -1) {
          targetCell = document.querySelector(`[data-yard="${player}-${tokenIdx}"]`);
        } else {
          targetCell = document.querySelector(`[data-cell="${r}-${c}"]`);
        }

        if (targetCell) {
          const tokenEl = document.createElement('div');
          tokenEl.className = `token token-${player}`;
          tokenEl.setAttribute('data-player', player);
          tokenEl.setAttribute('data-index', tokenIdx);

          // Highlight movable tokens
          if (canMoveToken(player, tokenIdx)) {
            tokenEl.classList.add('selectable');
          }

          tokenEl.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTokenClick(player, tokenIdx);
          });

          targetCell.appendChild(tokenEl);
        }
      });
    });

    // Check stacked tokens on cells
    document.querySelectorAll('.cell, .center-home').forEach(cell => {
      const tokensInCell = cell.querySelectorAll('.token');
      if (tokensInCell.length > 1) {
        cell.classList.add('cell-multi-tokens');
      } else {
        cell.classList.remove('cell-multi-tokens');
      }
    });

    // Update dice display
    if (gameState.diceValue) {
      diceCube.textContent = gameState.diceValue;
    } else {
      diceCube.textContent = '🎲';
    }

    // Check winner
    if (redHomeCount === 4) {
      showWinner('Shakibul');
    } else if (yellowHomeCount === 4) {
      showWinner('Jannatul');
    }
  }

  /* --------------------------------------------------------------------------
     7. Ludo Rules & Move Validation
     -------------------------------------------------------------------------- */
  function canMoveToken(player, tokenIdx) {
    // Must be the player's turn
    if (gameState.turn !== player) return false;
    // Must have rolled dice
    if (!gameState.rolled || !gameState.diceValue) return false;
    // If online, must be current client's player role
    if (myRole !== 'both' && myRole !== player) return false;

    const steps = gameState.tokens[player][tokenIdx];
    const dice = gameState.diceValue;

    // Token in yard: needs 6
    if (steps === -1) {
      return dice === 6;
    }

    // Token already home
    if (steps === 56) {
      return false;
    }

    // Exact roll needed to reach home
    if (steps + dice > 56) {
      return false;
    }

    return true;
  }

  function getMovableTokens(player) {
    const movable = [];
    for (let i = 0; i < 4; i++) {
      if (canMoveToken(player, i)) {
        movable.push(i);
      }
    }
    return movable;
  }

  function handleRoll() {
    if (gameState.winner) return;
    if (gameState.rolled) return;
    if (myRole !== 'both' && myRole !== gameState.turn) return;

    if (gameState.mode === 'guest') {
      // Send roll request to host
      if (peerConn && peerConn.open) {
        peerConn.send({ type: 'ROLL_REQUEST' });
      }
      return;
    }

    // Host or Offline logic
    executeRoll();
  }

  function executeRoll() {
    playSound('roll');
    diceCube.classList.add('rolling');

    setTimeout(() => {
      diceCube.classList.remove('rolling');
      const rolledVal = Math.floor(Math.random() * 6) + 1;
      gameState.diceValue = rolledVal;
      gameState.rolled = true;

      const movable = getMovableTokens(gameState.turn);

      if (movable.length === 0) {
        // No valid moves possible -> Next turn
        setTimeout(() => {
          nextTurn(false);
        }, 1000);
      } else if (movable.length === 1) {
        // Auto-move if only 1 token can move
        setTimeout(() => {
          executeMoveToken(gameState.turn, movable[0]);
        }, 600);
      } else {
        renderBoard();
        broadcastState();
      }
    }, 500);
  }

  function handleTokenClick(player, tokenIdx) {
    if (!canMoveToken(player, tokenIdx)) return;

    if (gameState.mode === 'guest') {
      // Send move request to host
      if (peerConn && peerConn.open) {
        peerConn.send({ type: 'MOVE_REQUEST', tokenIdx: tokenIdx });
      }
      return;
    }

    executeMoveToken(player, tokenIdx);
  }

  function executeMoveToken(player, tokenIdx) {
    const currentSteps = gameState.tokens[player][tokenIdx];
    const dice = gameState.diceValue;

    let newSteps = currentSteps;
    let extraTurn = false;

    if (currentSteps === -1) {
      // Exit yard
      newSteps = 0;
      extraTurn = true; // Roll of 6 grants extra turn
    } else {
      newSteps = currentSteps + dice;
      if (dice === 6) {
        extraTurn = true;
      }
    }

    gameState.tokens[player][tokenIdx] = newSteps;
    playSound('move');

    // Check for token capture on main path
    let captured = false;
    if (newSteps >= 0 && newSteps <= 50) {
      const myPathIdx = getMainPathIdx(player, newSteps);

      // Non-safe spot capture
      if (!SAFE_INDICES.includes(myPathIdx)) {
        const opponent = player === 'red' ? 'yellow' : 'red';
        gameState.tokens[opponent].forEach((opSteps, opIdx) => {
          if (opSteps >= 0 && opSteps <= 50) {
            const opPathIdx = getMainPathIdx(opponent, opSteps);
            if (opPathIdx === myPathIdx) {
              // Captured! Send opponent token back to yard
              gameState.tokens[opponent][opIdx] = -1;
              captured = true;
              playSound('capture');
            }
          }
        });
      }
    }

    // Reach home grants extra turn
    if (newSteps === 56) {
      extraTurn = true;
    }

    if (captured) {
      extraTurn = true;
    }

    // Reset roll status and determine turn
    gameState.rolled = false;
    gameState.diceValue = null;

    renderBoard();

    if (extraTurn) {
      turnSubtext.textContent = 'Extra Turn Granted! Roll again ✨';
      broadcastState();
    } else {
      nextTurn(true);
    }
  }

  function nextTurn(broadcast = true) {
    gameState.turn = gameState.turn === 'red' ? 'yellow' : 'red';
    gameState.rolled = false;
    gameState.diceValue = null;
    renderBoard();
    if (broadcast) {
      broadcastState();
    }
  }

  /* --------------------------------------------------------------------------
     8. PeerJS Real-Time Online Logic
     -------------------------------------------------------------------------- */
  function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function startHostMode() {
    roomCode = generateRoomCode();
    myRole = 'red';
    gameState.mode = 'host';

    createdCodeDisplay.textContent = roomCode;
    roomDetails.classList.remove('hidden');
    roomStatusText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Waiting for partner to join...';

    if (peer) peer.destroy();
    peer = new Peer(`ludo-sec-${roomCode}`);

    peer.on('open', () => {
      console.log('Host Peer initialized with code:', roomCode);
    });

    peer.on('connection', conn => {
      peerConn = conn;
      setupPeerConn();
      roomStatusText.innerHTML = '<i class="fas fa-check-circle"></i> Connected! Starting game...';

      setTimeout(() => {
        showGameView();
        connectionText.textContent = `Online Room: ${roomCode} (Host)`;
        broadcastState();
      }, 1000);
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
      showError('Connection Error', 'Could not create multiplayer room. Please try again.');
    });
  }

  function joinRoom(code) {
    if (!code || code.length !== 5) {
      alert('Please enter a valid 5-character room code.');
      return;
    }

    roomCode = code.toUpperCase();
    myRole = 'yellow';
    gameState.mode = 'guest';

    if (peer) peer.destroy();
    peer = new Peer();

    peer.on('open', () => {
      peerConn = peer.connect(`ludo-sec-${roomCode}`);
      setupPeerConn();
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
      showError('Room Not Found', 'Could not connect to room. Please check the code and retry.');
    });
  }

  function setupPeerConn() {
    peerConn.on('open', () => {
      if (gameState.mode === 'guest') {
        showGameView();
        connectionText.textContent = `Online Room: ${roomCode} (Guest)`;
      }
    });

    peerConn.on('data', data => {
      if (data.type === 'STATE_UPDATE') {
        gameState = data.state;
        renderBoard();
      } else if (data.type === 'ROLL_REQUEST' && gameState.mode === 'host') {
        executeRoll();
      } else if (data.type === 'MOVE_REQUEST' && gameState.mode === 'host') {
        executeMoveToken('yellow', data.tokenIdx);
      }
    });

    peerConn.on('close', () => {
      showError('Disconnected', 'Your partner disconnected from the game.');
    });
  }

  function broadcastState() {
    if (gameState.mode === 'host' && peerConn && peerConn.open) {
      peerConn.send({ type: 'STATE_UPDATE', state: gameState });
    }
  }

  /* --------------------------------------------------------------------------
     9. UI View Handlers & Modals
     -------------------------------------------------------------------------- */
  function showGameView() {
    modeSelection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    renderBoard();
  }

  function showModeSelection() {
    gameSection.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    roomDetails.classList.add('hidden');
  }

  function showError(title, msg) {
    errorModalTitle.textContent = title;
    errorModalMsg.textContent = msg;
    errorModal.classList.add('active');
  }

  function showWinner(name) {
    gameState.winner = name;
    playSound('win');
    winTitle.textContent = `${name} Wins! ❤️`;
    winLoveMsg.textContent = 'Our love wins every game of life! Forever & Always 💕';
    winModal.classList.add('active');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  function resetGame() {
    gameState = {
      mode: gameState.mode,
      turn: 'red',
      diceValue: null,
      rolled: false,
      extraTurn: false,
      winner: null,
      tokens: {
        red: [-1, -1, -1, -1],
        yellow: [-1, -1, -1, -1]
      }
    };
    winModal.classList.remove('active');
    errorModal.classList.remove('active');
    renderBoard();
    broadcastState();
  }

  /* --------------------------------------------------------------------------
     10. Event Listeners Initialization
     -------------------------------------------------------------------------- */
  function initEventListeners() {
    // Mode Buttons
    btnPassAndPlay.addEventListener('click', () => {
      gameState.mode = 'pass';
      myRole = 'both';
      connectionText.textContent = 'Pass & Play Mode (Offline)';
      showGameView();
    });

    btnCreateRoom.addEventListener('click', () => {
      startHostMode();
    });

    btnJoinRoom.addEventListener('click', () => {
      const code = roomCodeInput.value.trim();
      joinRoom(code);
    });

    btnCopyCode.addEventListener('click', () => {
      navigator.clipboard.writeText(roomCode);
      btnCopyCode.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btnCopyCode.innerHTML = '<i class="fas fa-copy"></i> Copy';
      }, 2000);
    });

    btnChangeMode.addEventListener('click', () => {
      showModeSelection();
    });

    btnRollDice.addEventListener('click', () => {
      handleRoll();
    });

    diceCube.addEventListener('click', () => {
      handleRoll();
    });

    // Sound Toggle Button
    soundToggle.addEventListener('click', () => {
      soundMuted = !soundMuted;
      if (soundMuted) {
        soundIcon.className = 'fas fa-volume-mute';
      } else {
        soundIcon.className = 'fas fa-volume-up';
        playSound('move');
      }
    });

    // Error Modal Buttons
    btnRetryConnection.addEventListener('click', () => {
      errorModal.classList.remove('active');
      if (gameState.mode === 'host') {
        startHostMode();
      } else if (gameState.mode === 'guest') {
        joinRoom(roomCode);
      }
    });

    btnErrorBack.addEventListener('click', () => {
      errorModal.classList.remove('active');
      showModeSelection();
    });

    // Win Modal Buttons
    btnPlayAgain.addEventListener('click', () => {
      resetGame();
    });

    btnWinBack.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Initialize Ludo Game on Page Load
  document.addEventListener('DOMContentLoaded', () => {
    buildBoardGrid();
    initEventListeners();
  });

})();
