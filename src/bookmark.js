import $ from 'jquery';
import store from './store.js';
import api from './api.js';

// Pass in a default parameter to make argument optional
const render = function (bookmarks=[...store.store.bookmarks]) {
    renderError();
  generateMainView();

 
  // render the bookmarks saved list in the DOM
  // creates new var bookmarkListString and calls
  // generateBookmarkListString function passing in new array "bookmarksSaved"
  const bookmarkListString = generateBookmarkListString(bookmarks);
  $('.js-bookmark-list').html(bookmarkListString);
};

/* Function that generates the main view of bm app */
const generateMainView = function () {
  $('main').html(`
<h1><u>My Bookmarks</u></h1>
<div class ="error-container"></div>
<section>
<div class="container"> 
<h2>Create a Bookmark</h2>       
<button type="button" button id="create-button">Create Bookmark</button><br><br>


<form id="createBookmark">
    <div class= "hidden">
    <label for="title">Title:</label><br>
    <input type="text" id="title" placeholder="Title of page" required><br><br>
    <label for="link">URL Link:</label><br>
    <input type="text" id="link" placeholder="URL Address" required><br><br>
    <label for="description">Description:</label><br>
    <textarea id="description" name= "Description" rows="10" cols="30" placeholder="Type your description here (optional)"></textarea><br><br>
    <label for="rating">Rating: 
      <select name="rating" id="rating" required>
        <option value="1" selected="selected">1 Star</option>
        <option value="2" selected="selected">2 Stars</option>
        <option value="3" selected="selected">3 Stars</option>
        <option value="4" selected="selected">4 Stars</option>
        <option value="5" selected="selected">5 Stars</option>
        </select>
      </label><br><br>
    <input type="submit" id="saveBookmark" value="Submit"><br><br>
    </div>
</form>
</div>   



<div class="dropdown container">
    <h2>Filter Bookmarks by Rating</h2>
    <form name="filterBM" id="filterBM" action="/action_page.php">
        Filter Bookmarks:  <select name="starRatings" id="starRatings">
        <option value="1" selected="selected">1 Star</option>
        <option value="2" selected="selected">2 Stars</option>
        <option value="3" selected="selected">3 Stars</option>
        <option value="4" selected="selected">4 Stars</option>
        <option value="5" selected="selected">5 Stars</option>
          </select>
          <br><br>
     
          <input type="submit" value="Submit">  
        </form>
  </div>

  
  <div class='container'>
    <h2>Bookmarks</h2>

<div>
    <ul class="js-bookmark-list">
    </ul>
</div>


</div>
</section>`

  );
};

/* This functions displays the bookmark list being stored */
const generateBookmarkElement = function (bookmark) {

  /* 'tabindex = 0' is a global attribute that indicates the elements can be
     focused and allows keyboard navigation (usually with the 'tab' key) */
  /* Any attribute on any element whose attribute name starts with data- is a data attribute */
  let bookmarkItem = `
    <div class="container js-bookmark-item" data-item-id="${bookmark.id}" tabindex="0">
    <div>Title: </div>
    <div>${bookmark.title}</div><br>
    <div class="hidden toggleDetails"><div>URL: </div>
    <div><a href="${bookmark.url}">${bookmark.url}</a></div><br>
    <div>Description:</div>
    <div>${bookmark.desc}</div></div><br>
    <div>Rating: </div>
    <div>${bookmark.rating}</div><br>
    <div><button type="button" id="deleteBM">Delete</button></div><br>
    <div><button type="button" id="detailedButton">Details</button></div><br>
    </div>`
   

  return bookmarkItem;
};

const generateBookmarkListString = function (bookmark) {
  // for every bookmark, call generateBookmarkElement function and store array in bmList variable
  let bmList = bookmark.map((list) => generateBookmarkElement(list));
  // returns a concatenated string of the bm list
  return bmList.join('');
};

/* This function gets the bookmark id and stores it and returns it
This fetches the id and stores the id  */
const getBookmarkIdFromElement = function(bookmarkElement){
  return $(bookmarkElement)
  // .closest - For each element in the set, get the first element that
  // matches the selector by testing the element itself and traversing up through
  // its ancestors in the DOM tree.
  .closest('.js-bookmark-item')
  // tore arbitrary data associated with the matched elements
  .data('item-id');
};


/* Generate error functions adds html for error content  */
const generateError = function (message) {
  return `<section class="error-content">
                <button id= "cancel-error">X</button>
                <p>${message}</p>
                </section>`;
};

/* checks for error and decides to store either an empty var
    or on with an error message */
const renderError = function(){
    if(store.error){
        const el = generateError(store.error);
        $('.error-container').html(el);
    }
    else{
        $('.error-container').empty();
    }
};



/* EVENT LISTENER FUNCTIONS */

/* Handle function for generating new bookmark */
const handleCreateBookmark = function () {
  $('main').on('click', '#create-button', (event) => {
    // Listens for user to click "create bookmark" button
    event.preventDefault();
    // Changes the creating object to true
    store.store.creating = true;

    // jquery method to remove hidden css
    $('.hidden').show();
  });
};

const handleSaveBookmark = function () {
  $('main').on('submit', '#createBookmark', (event) => {
    event.preventDefault();

    // .val method is primarily used to get the values of form elements
    // store the user input into a variable
    let title = $('#title').val();
    let url = $('#link').val();
    let desc = $('#description').val();
    let rating = $('#rating').val();

    let userBookmarkInfo = { title, url, desc, rating};
    api.createBookmark(userBookmarkInfo)
    .then((bookmarkData) => {
      store.addBookmark(bookmarkData);
      render();
    })

    // passed an error from api listApiFetch and will detail the error further
    .catch((error) => {
        store.setError(error.message);
        renderError();
    });
    //This is going to hide creating bookmark form
    $('.hidden').hide();
  });
};

  const handleFilterBookmark = function(){
  $('main').on('submit', '#filterBM', (event) =>{
    event.preventDefault();

    let filteredList = $('#starRatings').val();

    let filteredBMList = store.filterByRatings(filteredList);
    render(filteredBMList);
  })
} 

const handleDeleteBookmark = function(){
  $('main').on('click', '#deleteBM', (event =>{
    event.preventDefault();
    let bookmarkId = getBookmarkIdFromElement(event.currentTarget);
    
    api.deleteBookmark(bookmarkId)
    .then(()=>{
      store.findAndDelete(bookmarkId)
      render();
    })

    .catch((error)=>{
      store.setError(error.message);
      renderError();
    })

  }))
}

const handleDetailsButton = function(){
  $('main').on('click', '#detailedButton', (event) =>{
    let id = getBookmarkIdFromElement($(event.currentTarget));
    // the [] are attribute selectors 
    $('[data-item-id="'+id+'"] .toggleDetails').toggleClass('hidden');
  
  })
}


const bindEventListeners = function () {
  handleCreateBookmark();
  handleSaveBookmark();
  handleFilterBookmark();
  handleDeleteBookmark();
  handleDetailsButton();
};

export default {
  render,
  bindEventListeners,
};
