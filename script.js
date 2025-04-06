const wordSearchData = [
    { 
      words: ['BILL', 'CASH', 'LOAN'], 
      definitions: {
        'BILL': 'A statement of money owed for goods or services.',
        'CASH': 'Money in the form of coins or paper notes.',
        'LOAN': 'Money that is borrowed and expected to be paid back with interest.'
      }
    },
    { 
      words: ['BUDGET', 'ASSET', 'LIABILITY'], 
      definitions: {
        'BUDGET': 'An estimate of income and expenditure for a set period.',
        'ASSET': 'An item of value owned by an individual or company.',
        'LIABILITY': 'A company’s financial debts or obligations.'
      }
    },
    { 
      words: ['EQUITY', 'INTEREST', 'INCOME'], 
      definitions: {
        'EQUITY': 'The value of shares issued by a company.',
        'INTEREST': 'Money paid regularly for the use of borrowed capital.',
        'INCOME': 'Money received, typically on a regular basis, for work or investment.'
      }
    },
    { 
      words: ['MORTGAGE', 'STOCK', 'CREDIT'], 
      definitions: {
        'MORTGAGE': 'A legal agreement by which a bank lends money to a home buyer.',
        'STOCK': 'The goods or merchandise kept on the premises of a business.',
        'CREDIT': 'The ability of a customer to obtain goods or services before payment.'
      }
    },
    { 
      words: ['DIVIDEND', 'RENTAL', 'FISCAL'], 
      definitions: {
        'DIVIDEND': 'A sum of money paid regularly by a company to its shareholders.',
        'RENTAL': 'The payment made for the use of property or land.',
        'FISCAL': 'Relating to government revenue, especially taxes.'
      }
    }
  ];
  
  let selectedCells = [];
  let currentLevel = 0;
  
  function startLevel(level) {
    currentLevel = level;
    selectedCells = [];
    document.getElementById('game-grid').innerHTML = '';
    document.getElementById('word-list').innerHTML = '';
    document.getElementById('word-definition').innerHTML = '';
  
    createWordSearch(level);
  }
  
  function createWordSearch(level) {
    const grid = generateGrid(wordSearchData[level - 1].words);
    const gridContainer = document.getElementById('game-grid');
    const wordListContainer = document.getElementById('word-list');
  
    wordSearchData[level - 1].words.forEach(word => {
      const wordElement = document.createElement('div');
      wordElement.textContent = word;
      wordElement.classList.add('word');
      wordElement.dataset.word = word;
      wordElement.addEventListener('click', function() {
        selectWord(word);
      });
      wordListContainer.appendChild(wordElement);
    });
  
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.textContent = cell;
        cellElement.dataset.row = rowIndex;
        cellElement.dataset.col = colIndex;
        cellElement.addEventListener('click', handleCellClick);
        gridContainer.appendChild(cellElement);
      });
    });
  
    checkLevelCompletion(level);
  }
  
  function generateGrid(words) {
    const grid = Array.from({ length: 10 }, () => Array(10).fill(''));
    words.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
  
        if (direction === 'H' && col + word.length <= 10) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[row][col + i] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[row][col + i] = word[i];
            }
            placed = true;
          }
        }
  
        if (direction === 'V' && row + word.length <= 10) {
          let canPlace = true;
          for (let i = 0; i < word.length; i++) {
            if (grid[row + i][col] !== '') {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) {
              grid[row + i][col] = word[i];
            }
            placed = true;
          }
        }
      }
    });
  
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
        }
      }
    }
  
    return grid;
  }
  
  function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const selected = cell.classList.contains('selected');
    
    if (selected) {
      cell.classList.remove('selected');
      selectedCells = selectedCells.filter(sel => sel.row !== row || sel.col !== col);
    } else {
      cell.classList.add('selected');
      selectedCells.push({ row, col });
    }
  
    if (selectedCells.length === 2) {
      checkWord(selectedCells);
      selectedCells = [];
    }
  }
  
  function selectWord(word) {
    const wordElements = document.querySelectorAll('.word');
    wordElements.forEach(wordElement => {
      if (wordElement.dataset.word === word) {
        wordElement.classList.add('selected');
      }
    });
    showWordDefinition(word);
  }
  
  function showWordDefinition(word) {
    const definition = wordSearchData[currentLevel - 1].definitions[word];
    document.getElementById('word-definition').textContent = definition;
  }
  
  function checkWord(selectedCells) {
    const row1 = selectedCells[0].row;
    const col1 = selectedCells[0].col;
    const row2 = selectedCells[1].row;
    const col2 = selectedCells[1].col;
  
    const selectedWord = getSelectedWord(row1, col1, row2, col2);
  
    if (selectedWord) {
      markWordAsFound(selectedWord);
      checkLevelCompletion(currentLevel);
    }
  }
  
  function getSelectedWord(row1, col1, row2, col2) {
    let word = '';
    const direction = row1 === row2 ? 'H' : 'V';
  
    if (direction === 'H') {
      for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
        word += document.querySelector(`[data-row="${row1}"][data-col="${i}"]`).textContent;
      }
    } else if (direction === 'V') {
      for (let i = Math.min(row1, row2); i <= Math.max(row1, row2); i++) {
        word += document.querySelector(`[data-row="${i}"][data-col="${col1}"]`).textContent;
      }
    }
  
    return word;
  }
  
  function markWordAsFound(word) {
    const wordElements = document.querySelectorAll('.word');
    wordElements.forEach(wordElement => {
      if (wordElement.dataset.word === word) {
        wordElement.classList.add('selected');
      }
    });
  }
  
  function checkLevelCompletion(level) {
    const allWordsFound = wordSearchData[level - 1].words.every(word => {
      return document.querySelector(`.word[data-word="${word}"]`).classList.contains('selected');
    });
  
    if (allWordsFound) {
      document.getElementById('congratulations').style.display = 'block';
      document.getElementById('crypto-button').style.display = 'block';
    }
  }
  
  function goToCrypto() {
    alert('Go mine some salt!');
  }
  
  startLevel(1);
  