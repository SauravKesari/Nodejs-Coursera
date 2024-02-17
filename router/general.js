const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  const User = {
    username: username,
    password: password
  };

  if(!isValid(username)){
    users.push(User);
  }
  return res.json(users);
});

// Get books details by async and await
public_users.get('/', async function (req, res) {
    try {
        return res.json(books);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


//Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json(books);
});

//Get Book details by ISBN using async awit
public_users.get('/isbn/:isbn',async function (req, res) {
    try{
    const filteredBooks = Object.values(books).filter(book => book.isbn === req.params.isbn);
    return res.json(filteredBooks);
    } catch(err){
        return res.json({message:"Something went wrong"});
    }
 });
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const filteredBooks = Object.values(books).filter(book => book.isbn === req.params.isbn);
    return res.json(filteredBooks);
 });
// Get Book detail by author using async await
public_users.get('/author/:author',async function (req, res) {
    try{
        const filteredBooks = Object.values(books).filter(book => book.author === req.params.author);
        return res.json(filteredBooks);
    }catch(err){
        return res.json(err,{message:"Something wrong !"});
    }
});  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const filteredBooks = Object.values(books).filter(book => book.author === req.params.author);
    return res.json(filteredBooks);
});

// Get books by title using async await
public_users.get('/title/:title',async function (req, res) {
    try {
    const filteredBooks = Object.values(books).filter(book => book.title === req.params.title);
    return res.json(filteredBooks);
    } catch(err){
        return res.json(err,{message:"Something wrong !"});
    }
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const filteredBooks = Object.values(books).filter(book => book.title === req.params.title);
    return res.json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const filteredBooks = Object.values(books).filter(book => book.isbn === req.params.isbn);
    if(filteredBooks.length <= 0) {
        return res.status(400).json({message:"No books found!"});
    }
    const reviews = filteredBooks.map(book => book.reviews);
    return res.json(reviews);
});

module.exports.general = public_users;
