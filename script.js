// Retrieve the elements from the HTML page
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageContainer = document.getElementById('imageContainer');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.getElementsByClassName('close')[0];
const moreImagesButton = document.getElementById('moreImagesButton');

let currentPage = 1;
let currentQuery = '';

// Function to handle the search button click event
function handleSearch() {
  // Get the search query from the input field
  const query = searchInput.value;
  if (query.trim() === '') {
    return;
  }

  // Reset the current page and image container
  currentPage = 1;
  currentQuery = query;
  imageContainer.innerHTML = '';

  // Call the function to load images for the query
  loadImages(query);
}

// Function to handle the filter button click event
function handleFilter(tag) {
  // Reset the current page and image container
  currentPage = 1;
  currentQuery = tag;
  imageContainer.innerHTML = '';

  // Call the function to load images for the selected tag
  loadImages(tag);
}

// Function to load images for a given query or tag
function loadImages(query) {
  const apiKey = '38037221-2273b01c62481dfc7f61a369c'; // Replace with your Pixabay API key
  let url = `https://pixabay.com/api/?key=${apiKey}&page=${currentPage}`;

  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.hits.length > 0) {
        data.hits.forEach(hit => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `<img src="${hit.webformatURL}" alt="${hit.tags}">`;
          card.addEventListener('click', () => openModal(hit));
          imageContainer.appendChild(card);
        });
        currentPage++;
        moreImagesButton.style.display = 'block';
      } else {
        moreImagesButton.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to open the modal and display item details
function openModal(item) {
  modalContent.innerHTML = `
    <h2>${item.tags}</h2>
    <img src="${item.largeImageURL}" alt="${item.tags}">
  `;
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Attach the click event listener to the search button
searchButton.addEventListener('click', handleSearch);

// Attach the click event listener to the close button in the modal
closeBtn.addEventListener('click', closeModal);

// Attach the click event listener to the "More Images" button
moreImagesButton.addEventListener('click', () => loadImages(currentQuery));

// Attach click event listeners to the filter buttons
const filterButtons = document.querySelectorAll('.tag');
filterButtons.forEach(button => {
  const tag = button.dataset.tag;
  button.addEventListener('click', () => handleFilter(tag));
});
