const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // If username and password are valid, generate a JWT token
    const token = jwt.sign({ username: username }, 'asdfgh', { expiresIn: '1h' });

    // You can return additional user information along with the token if needed
    return res.status(200).json({ token: token, message: "Login successful." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    // Add the review to the book's reviews array
    const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);

    if(filteredBooks.length < 1) {
        return res.send("No book found");
    }
    
    const bookToUpdate= filteredBooks[0];
    if (!bookToUpdate.hasOwnProperty('reviews')) {
        bookToUpdate.reviews = {};
    }

    // Add the review to the book's reviews array
    const reviewId = Object.keys(req.user.username); // Generate a unique review ID
    bookToUpdate.reviews[req.user.username] = review
    return res.status(201).json({ message: "Review added successfully." });

});

//Delete review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    console.log(req.user.username);
    const filteredBooks = Object.values(books).filter(book=> book.isbn === req.params.isbn);
    if(filteredBooks.length < 1){
        return res.status(400).json({message:"Book not found."});
    }
    const filteredReviews = Object.entries(filteredBooks[0].reviews).reduce((acc, [reviewer, review]) => {
        if (reviewer === req.user.username) {
            acc.push(review);
        }
        return acc;
    }, []);    

    if (filteredReviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for the current user." });
    }

    // Delete the filtered reviews associated with the book
    filteredReviews.forEach(review => {
        delete filteredBooks[0].reviews[req.user.username];
    });
    return res.status(200).json({message:"Deleted Successfully"});
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
