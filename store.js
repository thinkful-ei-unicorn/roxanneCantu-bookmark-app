"use strict";

const store = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0,
  };




  /* This addBookmark function adds/pushes a new objct to the
    bookmarks array of objects */
  const addBookmark = function(bookmark){
    this.store.bookmarks.push(bookmark);
    
  };



  /* This findById function finds the matching id of a bookmark
    and returns it and is stored in a variable. */
  const findById = function(id){
    // use .find to find matching id to current bookmark and store
    // in variable. Return variable in the end.
    let foundBookmark = this.store.bookmarks.find(currentBM => currentBM.id === id);
    return foundBookmark;
  };



  /* This findAndUpdate function finds the matching id and
    updates the existing object and updates the data */
  const findAndUpdate = function(id, newData){
    // Find the id using the passed id and the findById function
    let getMatchId = this.findById(id);
    // Use Object.assign() to merge the newData into the current object
    Object.assign(getMatchId, newData);
  };


  /* This findAndDelete function finds the matching id and 
      deletes the bookmark object from the array. */
  const findAndDelete = function(id){
    /* This creates an array of all the id's that do not match the id passed as an argument */
    this.store.bookmarks = this.store.bookmarks.filter(currentBM => currentBM.id !== id);

  };

  /* This function filters bookmarks by ratings */
  const filterByRatings = function(rating){
    let filteredList = this.store.bookmarks.filter(currentBookmark => currentBookmark.rating >= rating);
    return filteredList;
  };

  
 

  export default{
    store,
    addBookmark,
    findById,
    findAndUpdate,
    findAndDelete,
    filterByRatings,
  };

