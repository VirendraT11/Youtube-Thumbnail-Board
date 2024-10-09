document.addEventListener("DOMContentLoaded", function() {
  const boardList = document.getElementById('boardList');
  const addBoardButton = document.getElementById('addBoardButton');
  const thumbnailBoard = document.getElementById('thumbnailBoard');
  const addThumbnailButton = document.getElementById('addThumbnailButton');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const currentBoardTitle = document.getElementById('currentBoardTitle');

  let boards = [];
  let currentBoardIndex = 0;

  // Sample thumbnail data with actual image URLs
  const sampleThumbnails = [
    {
        id: '1',
        imageUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    },
    {
        id: '2',
        imageUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    },
    {
        id: '3',
        imageUrl: 'https://img.youtube.com/vi/6iF8Xb7Z3wQ/maxresdefault.jpg', 
    },
    {
        id: '4',
        imageUrl: 'https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg', 
    },
    {
        id: '5',
        imageUrl: 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg', 
    }
    // Add more sample thumbnails as needed
  ];





  function renderBoards() {
      boardList.innerHTML = '';
      boards.forEach((board, index) => {
          const boardElement = document.createElement('li');
          boardElement.textContent = board.title;
          boardElement.addEventListener('click', () => switchBoard(index));
          boardList.appendChild(boardElement);
      });
  }

  function switchBoard(index) {
      currentBoardIndex = index;
      currentBoardTitle.textContent = boards[index].title;
      renderThumbnails();
  }

  addBoardButton.addEventListener('click', function() {
      const newBoardTitle = prompt("Enter new thumbnail board title:");
      if (newBoardTitle) {
          const newBoard = { title: newBoardTitle, thumbnails: [] };
          boards.push(newBoard);
          renderBoards();
          switchBoard(boards.length - 1); // Switch to the new board
      }
  });

  function renderThumbnails() {
      const thumbnails = boards[currentBoardIndex].thumbnails;
      thumbnailBoard.innerHTML = '';
      thumbnails.forEach(thumbnail => {
          const thumbnailElement = document.createElement('div');
          thumbnailElement.className = 'thumbnail';
          thumbnailElement.innerHTML = `
              <img src="${thumbnail.imageUrl}" alt="Thumbnail" style="width: 100%; height: auto;" />
          `;
          thumbnailBoard.appendChild(thumbnailElement);
      });
  }

  addThumbnailButton.addEventListener('click', function() {
      const newThumbnailUrl = thumbnailInput.value.trim();
      if (newThumbnailUrl && isValidUrl(newThumbnailUrl)) {
          const videoId = extractVideoId(newThumbnailUrl);
          const imageUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          const newThumbnail = {
              id: Date.now().toString(),
              imageUrl: imageUrl,
          };

          // Add new thumbnail to the current board
          boards[currentBoardIndex].thumbnails.push(newThumbnail);
          renderThumbnails();
          thumbnailInput.value = ''; // Clear input
      } else {
          alert('Please enter a valid YouTube URL.');
      }
  });

  function isValidUrl(url) {
      return url.startsWith('http://') || url.startsWith('https://');
  }

  function extractVideoId(url) {
      const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null; // Return video ID or null
  }

  // Initialize the application with sample data
  boards.push({ title: "Default Board", thumbnails: sampleThumbnails });
  renderBoards();
  switchBoard(0); // Start with the first board
});
