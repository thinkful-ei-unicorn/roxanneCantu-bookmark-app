"use strict";

const BASE_URL= 'https://thinkful-list-api.herokuapp.com/roxanne/bookmarks';


/* This listApiFetch function catches errors */
/* The rest parameter syntax (...args) allows us to represent
    an indefinite number of arguments as an array */
const listApiFetch = function(...args){
    // make variable in scope outside of promise chain
    let error;

    // Separate the objects and pass them in individually
    return fetch(...args)
    .then(response => {

        /* If response error is not okay, then error variable
            is set to an object where key is code and value is 
            the response status */
        if(!response.ok){
            error = {code: response.status};

        /* If get response is not JSON type, place statusText in
            error object and immediately reject promise */
        if(!response.headers.get('Content-Type').includes('json')){
            // Assumes object accepts keys
            // statusText returns the status message corresponding to the status code
            error.message = response.statusText;
            return Promise.reject(error);
        }
        }
            //Otherwise, return parsed json
            return response.json();
    })
    // returned response.json is stored in data 
    .then(data => {

        // if error exists, place JSON message into the error
        // object and reject the promise w/your error object 
        // so it lands in the next catch.

        // refers to line 20 & 21 error
        if(error){
            error.message = data.message;
            return Promise.reject(error);
        }
        // otherwise, return json as normal resolve promise
        return data;
    });
};



/* GET bookmarks function that returns a resolved promise */
const getBookmark = function(){
   return listApiFetch(BASE_URL, {});
};

/* POST function that creates a new bookmark  */
const createBookmark = function(bookmark){
    // newBookmark creates a new varible that makes the argument
    // passed in a string. This variable is set to body
    let newBookmark = JSON.stringify(bookmark);
    return listApiFetch(BASE_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: newBookmark
    });
};


/* This PATCH function updates the information on a bookmark  */
const updateBookmark = function(id, updateBM){
    let newData = JSON.stringify(updateBM);

    return listApiFetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: newData
    });

};


/* This DELETE function makes a delete request to delete a bookmark object  */
const deleteBookmark = function(id){
    return listApiFetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
};


export default{
    getBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark
};

