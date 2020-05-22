'use strict';

/* Helper functions --- */
// Repeat
Array.prototype.repeat = function(repeats) {
  // From https://stackoverflow.com/a/50672154/7982963
  return [].concat(...Array.from({ length: repeats }, () => this));
}
// Shuffle
Array.prototype.shuffle = function() {
  // from https://stackoverflow.com/a/6274381/7982963
  for (let i = this.length-1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    [this[i], this[randomIndex]] = [this[randomIndex], this[i]]
  }
  return this;
}
// Remove All children
Node.prototype.removeAll = function () {
  while (this.firstChild) { this.removeChild(this.firstChild); }
  return this;
};
// Pad time with zeros
const zeroPadded = num => (num < 10) ? `0${num}` : num;

/* Card Class --- */
class Card {
  constructor(id, symbolName, src, meaning) {
    this.id = id;
    this.symbolName = symbolName;
    this.src = src;
    this.meaning = meaning;
  }
}

/* ===================================
  Model
  ==================================== */
const model = {
  cards: [
    new Card(1, 'Ankh', 'images/ankh.jpg',
      'The ankh represents the concept of eternal life. It frequently appears in Egyptian tomb paintings and other art.'
    ), // id, name, src, meaning
    new Card(2, 'Djed', 'images/djed.jpg',
      'Djed is for stability. It was primarily associated with themes of rebirth and regeneration.'
    ), 
    new Card(3, 'Wadjet Eye', 'images/wadjet-eye.jpg', 
      'It was known as a slogan to protect against envy, disease, harmful animals and evil spirits.'
    ),
    new Card(4, 'Was Sceptre', 'images/was-sceptre.jpg', 
      'It was the symbol of power in ancient Egyptian culture. It also represented the dominion of gods.'
    ),
    new Card(5, 'Feather Of Maat', 'images/feather-of-maat.jpg', 
      'Named after the goddess Maat who represented justice in Egyptian culture.'
    ),
    new Card(6, 'Egyptian Ouroboros', 'images/ouroboros.jpg', 
      'One of the symbols of the sun, as it represented the journeys of Aten, the solar disk in Egyptian mythology.'
    ),
    new Card(7, 'BA symbol', 'images/ba-symbol.jpg', 
      'Human personality in the spirit world. Conceived in the form of a bird with a human head carrying the features of the deceased person and spirit where she leaves the body after death to the sky where she lives in the stars'
    ),
    new Card(8, 'Amenta', 'images/amenta.jpg', 
      'Amenta symbol represents the land of the dead (the earthly world).'
    )
  ],
  selectedId: null,
  firstClick: true,
  matchingResult: '',
  character: '',
  moves: 0,
  time: {
    seconds: 0,
    minutes: 0
  },
  stars: 3
}

/* ===================================
  Octopus
  ==================================== */
const octopus = {
  getMovesRecord() {
    return model.moves;
  },
  getTime() {
    return model.time;
  },
  getStarsNum() {
    return model.stars;
  },
  getCards() {
    return model.cards;
  },
  getSelectedId() {
    return model.selectedId;
  },
  setSelectedId(id) {
    model.selectedId = id;
  },
  resetSelectedId() {
    model.selectedId = null;
  },
  incrementMoves() {
    model.moves++;
    movesView.render();
    modalView.render();
  },
  startTimer() {
    timerView.start()
  },
  updateTime(seconds, minutes) {
    model.time.seconds = seconds;
    model.time.minutes = minutes;
    timerView.render();
    modalView.render();
  },
  stopTimer() {
    timerView.stop();
  },
  isFirstClick() {
    return model.firstClick;
  },
  falseFirstClick() {
    model.firstClick = false;
  },
  determineStarsNum() {
    starsView.determineNum(model.moves);
  },
  updateStars(num) {
    model.stars = num;
    starsView.render();
  },
  getMatchingResult() {
    return model.matchingResult;
  },
  updateMatchingResult(str) {
    model.matchingResult = str;
    gameStatus.render();
  },
  getCharacter() {
    return model.character;
  },
  updateCharacter(character) {
    model.character = character;
    gameStatus.render();
  },
  openDialog() {
    modalView.openDialog();
  },
  closeDialog() {
    modalView.closeDialog();
  },
  updateSymbol() {
    symbol.render()
  },
  reset(focusedIndex) {
    model.moves = 0;
    model.stars = 3;
    model.matchingResult = '';
    model.character = '';
    // Board
    model.selectedId = null;
    model.firstClick = true;
    boardView.reset();
    symbol.reset();

    // Render
    movesView.render();
    timerView.reset();
    starsView.render();
    window.setTimeout(() => boardView.render(focusedIndex), 300); // Card showing time
    gameStatus.render();
  },
  init() {
    keyboardSupportView.init();
    movesView.init();
    timerView.init();
    starsView.init();
    boardView.init();
    resetButton.init();
    rulesView.init();
    gameStatus.init();
    modalView.init();
    symbol.init();
  }
}

/* ===================================
  Views
  ==================================== */

/* Keyboard support --- */
const keyboardSupportView = {
  init() {
    this.startButton = document.querySelector('.keyboard-support button');
    this.startButton.addEventListener('click', function focusFirstCard() {
      const firstCard = document.querySelector('.card button');
      firstCard.focus();
    })
  }
}

/* Rules --- */
const rulesView = {
  init() {
    this.viewRulesButton = document.querySelector('#rules-section button');
    this.rules = document.querySelector('#rules');
    this.viewRulesButton.addEventListener('click', () => {
      if (this.viewRulesButton.getAttribute('aria-pressed') === 'false'){
        this.expand();
      } else {
        this.collapse();
      }
    });
  },
  expand() {
    rules.style.cssText = 'overflow: auto; height: auto;';

    this.viewRulesButton.setAttribute('aria-pressed', 'true');
    this.viewRulesButton.setAttribute('aria-expanded', 'true');
  },
  collapse() {
    rules.style.cssText = 'overflow: hidden; height: 0;';

    this.viewRulesButton.setAttribute('aria-pressed', 'false');
    this.viewRulesButton.setAttribute('aria-expanded', 'false');
  }
}

/* Moves ---*/
const movesView = {
  init() {
    this.movesRecord = document.querySelector('.moves-record');
    this.render();
  },
  render() {
    const moves = octopus.getMovesRecord();
    this.movesRecord.textContent = (moves === 1) ? (moves + ' move')
    : (moves + ' moves');
  }
}

/* Timer --- */
const timerView = {
  init() {
    this.timer = document.querySelector('.timer');
    this.render();
  },
  start() {
    let seconds = 0, minutes = 0;
    const incrementSecond = () => {
      if (seconds + 1 === 60) {
        minutes++;
        seconds = 0;
      } else {
        seconds++;
      }
      octopus.updateTime(seconds, minutes);
    }
    this.interval = window.setInterval(incrementSecond, 1000);
  },
  stop() {
    clearInterval(this.interval)
  },
  reset() {
    this.stop();
    const seconds = 0, minutes = 0;
    octopus.updateTime(seconds, minutes);
  },
  render() {
    const {seconds, minutes} = octopus.getTime();
    const timeString = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
    this.timer.textContent = timeString;
  }
}

/* Stars --- */
const starsView = {
  init() {
    this.starsLists = Array.from(document.querySelectorAll('.stars-list'));
    this.render();
  },
  determineNum(moves) {
    if (moves > 12) {
      const starsNum = (moves > 16) ? 1
                     : (moves > 20) ? 0
                     : 2
      octopus.updateStars(starsNum);
    }
  },
  render() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < octopus.getStarsNum(); i++) {
      const listItem = document.createElement('li');
      listItem.classList.add('star');
      listItem.innerHTML = '<span role="img" aria-label="Star">★</span>';
      fragment.appendChild(listItem);
    }
    this.starsLists.forEach(starsList => {
      starsList.innerHTML = '';
      starsList.appendChild(fragment.cloneNode(true));
    });
  }
}

/* Reset button --- */
const resetButton = {
  init() {
    this.button = document.querySelector('.reset');
    this.button.addEventListener('click', () => {
      this.reset();
    });
  },
  reset() {
    octopus.reset();
  }
}

/* Board --- */
const boardView = {
  init() {
    this.board = document.querySelector('.board');
    this.adjustBoardHeight();

    this.rows = Array.from(document.querySelectorAll('.row'));

    this.clickEnabled = true;
    this.board.addEventListener('click', event => {
      if (!this.clickEnabled) return;

      const target = event.target;
      if (target.nodeName !== 'UL') { // Card is clicked
        if (octopus.isFirstClick()) {
          octopus.startTimer();
          octopus.falseFirstClick();
        }

        const card = (target.nodeName === 'LI') ? target.querySelector('button')
        : (target.nodeName === 'BUTTON') ? target
        : (target.nodeName === 'IMG') ? target.parentNode.parentNode
        : target.parentNode; // target: <div class="front"> inside button
        console.log(card);

        const currentId = card.getAttribute('data-id');
        const firstId = octopus.getSelectedId();

        // Making sure player cant click the same card
        const sameCard = (card.getAttribute('aria-selected') === 'true');
        if (sameCard) return;

        octopus.updateCharacter(card.getAttribute('data-name'));
        this.trueAriaSelectedAttr(card);

        if (firstId === null) { // No cards previously selected
          octopus.setSelectedId(currentId);
        } else { // A card is already clicked, so let's test with the new card
          octopus.incrementMoves();
          octopus.determineStarsNum();
          this.matchAndRespond(firstId, currentId);
        }
      }
    });

    this.interactiveKeys = {
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    this.render();
  },
  adjustBoardHeight(){
    this.board.style.height = this.board.offsetWidth + 'px';
    window.addEventListener('resize', () => {
      this.board.style.height = this.board.offsetWidth + 'px';
    });
  },
  matchAndRespond(firstId, secondId) {
    const visualFeedbackTime = 1100;
    this.clickEnabled = false;
    window.setTimeout((() => this.clickEnabled = true), visualFeedbackTime);
    if (firstId === secondId) {
      const matchedCards = this.cards.filter(card => (card.getAttribute('data-id') === firstId));
      octopus.updateMatchingResult('match');
      this.flashMatching(matchedCards); // Visiual feedback first
      this.trueDataMatchedAttr(matchedCards);
      this.checkWin();
      octopus.updateSymbol();
    } else {
      const unmatchedCards = this.cards.filter(card => (card.getAttribute('aria-selected') === 'true') && (card.getAttribute('data-matched') === 'false'));
      octopus.updateMatchingResult('different');
      this.flashUnmatching(unmatchedCards); // Visiual feedback first
      window.setTimeout(() => {
        this.falseAriaSelectedAttr(unmatchedCards);
      }, visualFeedbackTime);
    }
    octopus.resetSelectedId();
  },
  flashMatching(matchedCards) {
    const cardShowingTime = 300;
    const flashTime = 200;
    // Keyframe alternative
    window.setTimeout(() => {
      this.backgroundGreen(matchedCards);
      window.setTimeout(() => {
        this.backgroundWhite(matchedCards);
        window.setTimeout(() => {
          this.backgroundGreen(matchedCards);
          window.setTimeout(() => {
            this.backgroundWhite(matchedCards);
          }, flashTime);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime)
  },
  flashUnmatching(unmatchedCards) {
    const cardShowingTime = 300;
    const flashTime = 200;
    // Keyframe alternative
    window.setTimeout(() => {
      this.backgroundRed(unmatchedCards);
      window.setTimeout(() => {
        this.backgroundWhite(unmatchedCards);
        window.setTimeout(() => {
          this.backgroundRed(unmatchedCards);
          window.setTimeout(() => {
            this.backgroundWhite(unmatchedCards);
          }, flashTime);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime)
  },
  backgroundRed(cards) {
    cards.forEach(card => card.querySelector('.back').setAttribute('data-overlay', 'red'));
  },
  backgroundGreen(cards) {
    cards.forEach(card => card.querySelector('.back').setAttribute('data-overlay', 'green'));
  },
  backgroundWhite(cards) {
    cards.forEach(card => card.querySelector('.back').setAttribute('data-overlay', 'trans'));
  },
  trueDataMatchedAttr(matchedCards) {
    matchedCards.forEach(card => card.setAttribute('data-matched', 'true'));
  },
  trueAriaSelectedAttr(card) {
    card.setAttribute('aria-selected', 'true');
  },
  falseAriaSelectedAttr(unmatchedCards) {
    unmatchedCards.forEach(card => card.setAttribute('aria-selected', false));
  },
  checkWin() {
    const allMatched = this.cards.every(card => card.getAttribute('data-matched') === 'true');
    if (allMatched) {
      octopus.updateMatchingResult('Done');
      octopus.stopTimer();
      setTimeout(() => {
        octopus.openDialog();
      }, 300 + 1000); // Card opening time: 300
    }
  },
  reset() {
    this.falseAriaSelectedAttr(this.cards);
  },
  handleInput(card, cardOrder, direction) {
    let activeCard, previousCard = card;
    switch (direction) {
      case 'right':
        if (cardOrder !== 15) { // Last card
          activeCard = this.cards[cardOrder+1];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case 'left':
        if (cardOrder !== 0) { // First card
          activeCard = this.cards[cardOrder-1];
          this.activateCard(previousCard, activeCard);
        } 
        break;
      case 'down':
        if (cardOrder >= 12 && cardOrder <= 14) { // Last row
          activeCard = this.cards[cardOrder-11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 15) {
          activeCard = this.cards[cardOrder+4];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case 'up':
        if (cardOrder >= 1 && cardOrder <= 3) { // First row
          activeCard = this.cards[cardOrder+11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 0) {
          activeCard = this.cards[cardOrder-4];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case 'home':
        if (cardOrder <= 3) {
          activeCard = this.cards[0];
        } else if (cardOrder <= 7) {
          activeCard = this.cards[4];
        } else if (cardOrder <= 11) {
          activeCard = this.cards[8];
        } else {
          activeCard = this.cards[12];
        }
        this.activateCard(previousCard, activeCard);
        break;
      case 'end':
        if (cardOrder >= 12) {
          activeCard = this.cards[15];
        } else if (cardOrder >= 8) {
          activeCard = this.cards[11];
        } else if (cardOrder >= 4) {
          activeCard = this.cards[7];
        } else {
          activeCard = this.cards[3];
        }
        this.activateCard(previousCard, activeCard);
        break;
    }
  },
  activateCard(oldCard, newCard) {
    oldCard.blur();
    oldCard.setAttribute('tabindex', '-1'); // Remove from tab sequence
    newCard.focus();
    newCard.setAttribute('tabindex', '0'); //Set in the tab sequence
  },
  render(focusedIndex) {
    this.rows.forEach(row => row.querySelector('ul').removeAll());
    const fragment = document.createDocumentFragment();
    let rowIndex = 0;
    const cards = octopus.getCards().repeat(2).shuffle();
    cards.forEach((card, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('card');
      if (index === 0) { // Only the first card will be in the tab sequence
        listItem.innerHTML = `<button type="button" data-matched="false" role="gridcell" aria-selected="false" aria-label="card ${index+1}" data-id="${card.id}" data-num="${index}" data-name="${card.characterName}">
          <div class="back">
            <img src="${card.src}" alt="Anime Character" class="backImage">
          </div>
          <div class="front"></div>
        </button>`;
      } else { // tabindex="-1"
        listItem.innerHTML = `<button type="button" data-matched="false" role="gridcell" aria-selected="false" aria-label="card ${index+1}" data-id="${card.id}" tabindex="-1" data-num="${index}" data-name="${card.characterName}">
          <div class="back">
            <img src="${card.src}" alt="Anime Character" class="backImage">
          </div>
          <div class="front"></div>
        </button>`;
      }
      fragment.appendChild(listItem);
      if (fragment.children.length === 4) { // Row
        this.rows[rowIndex].querySelector('ul').appendChild(fragment);
        rowIndex++;
        fragment.removeAll();
      }
    })
    this.cards = Array.from(document.querySelectorAll('[data-id]'));
    if (focusedIndex) {
      this.cards[focusedIndex].focus();
    }

    // Managing Focus - Keyboard support
    this.cards.forEach(card => {
      card.addEventListener('keydown', event => {
        if (event.keyCode === 35 || event.keyCode === 36) event.preventDefault(); // home || end
        const cardOrder = card.getAttribute('data-num');
        this.handleInput(card, Number(cardOrder), this.interactiveKeys[event.keyCode]);
      })
    })
  }
}

/* Game status --- */
const gameStatus = {
  init() {
    this.matchingResult = document.querySelector('#matching-result');
    this.character = document.querySelector('#character');
  },
  render() {
    this.matchingResult.textContent = octopus.getMatchingResult();
    this.character.textContent = 'Character name: ' + octopus.getCharacter();
  }
}

/* Modal Window --- */
const modalView = {
  init() {
    this.modalContainer = document.querySelector('#modal-container');
    this.modal = document.querySelector('#result-modal');
    this.movesAndTime = document.querySelector('#moves-time');
    this.button = document.querySelector('#play-again');
    // Event listeners
    this.button.addEventListener('click', () => {
      octopus.closeDialog();
      octopus.reset(this.focusedElementBeforeModal.getAttribute('data-num')); // Pass a refernce to the last focused element so it's focused again after resetting
    })
    this.button.addEventListener('keydown', event => {
      if (event.keyCode === 9) event.preventDefault(); // tab: Focus trap
      else if (event.keyCode === 27) this.closeDialog(); // esc: close
    })
    this.modalContainer.addEventListener('click', event => {
      if (event.target === this.modalContainer) {
        this.closeDialog();
      }
    })

    this.render();
  },
  generateResultStr(moves, seconds, minutes) {
    let resultStr;
    if (minutes > 0) {
      resultStr = `${moves} ${(moves === 1) ? 'move' : 'moves'} in ${minutes} ${(minutes === 1) ? 'minute' : 'minutes'}`;
      if (seconds > 0) {
        resultStr += ` and ${seconds} ${(seconds === 1) ? 'second' : 'seconds'}`;
      }
    } else { // minutes = 0
      resultStr = `${moves} ${(moves === 1) ? 'move' : 'moves'} in ${seconds} ${(seconds === 1) ? 'second' : 'seconds'}`;
    }
    return resultStr;
  },
  openDialog() {
    this.focusedElementBeforeModal = document.activeElement; // Reference to the last focused element
    this.modalContainer.setAttribute('data-visible', 'true');
    this.modal.open = true;
    this.button.focus();
  },
  closeDialog() {
    this.modalContainer.setAttribute('data-visible', 'false');
  },
  render() {
    const {seconds, minutes} = octopus.getTime();
    const moves = octopus.getMovesRecord();
    const resultStr = this.generateResultStr(moves, seconds, minutes);
    this.movesAndTime.textContent = resultStr;
  }
}

/* Meaning window --- */
const symbol = {
  init() {
    this.parent = document.querySelector('.board-section');
  },
  reset() {
    const symbol = document.querySelector('.symbol');
    if (symbol) symbol.remove();
  },
  render() {
    this.reset();
    const cardId = octopus.getSelectedId();
    const cards = octopus.getCards();
    const { symbolName, src, meaning } = cards.find(card => card.id == cardId);

    const html = `
      <div class="symbol">
        <img class="symbol__image" src="${src}" alt="">
        <h2 class="symbol__name">${symbolName}</h2>
        <p class="symbol__meaning">${meaning}</p>
      </div>
    `;
    this.parent.insertAdjacentHTML('beforeend', html);
  }
}

octopus.init();
