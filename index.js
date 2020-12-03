"use strict";

import $ from 'jquery';
import api from './api';
import './style.css';
import store from './store.js';
import bookmark from './bookmark.js';



const main = function (){

    /* Here we are: fetching all of our bookmarks,
    iterating through the response,
    running store.addBookmark on each response,
    and re-running bookmark.render()  */
    api.getBookmark()
    .then((bookmarks) => {
        bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
        bookmark.render();
    });

 bookmark.bindEventListeners();

 bookmark.render();
};


$(main);