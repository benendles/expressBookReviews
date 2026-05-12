const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const axios = require('axios');

const BASE_URL = "http://localhost:5000";


// =========================
// TASK 6 - REGISTER USER
// =========================
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password required"
        });
    }

    if (isValid(username)) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.json({
        message: "User registered successfully"
    });
});


// =========================
// TASK 1 - GET ALL BOOKS
// =========================
public_users.get('/', function (req, res) {

    return res.json(books);

});


// =========================
// TASK 2 - GET BOOK BY ISBN
// =========================
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.json(book);

});


// =========================
// TASK 3 - GET BOOKS BY AUTHOR
// =========================
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    const result = [];

    Object.keys(books).forEach((key) => {

        if (books[key].author === author) {

            result.push(books[key]);

        }

    });

    return res.json(result);

});


// =========================
// TASK 4 - GET BOOKS BY TITLE
// =========================
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    const result = [];

    Object.keys(books).forEach((key) => {

        if (books[key].title === title) {

            result.push(books[key]);

        }

    });

    return res.json(result);

});


// =========================
// TASK 5 - GET BOOK REVIEWS
// =========================
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = books[isbn];

    if (!book) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

    return res.json(book.reviews);

});


// ==========================
// TASK 10 - GET ALL BOOKS USING ASYNC/AWAIT
// ==========================
public_users.get('/async/books', async function (req, res) {

    try {

        const response = await axios.get(`${BASE_URL}/`);

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});


// ==========================
// TASK 11 - GET BOOK BY ISBN USING ASYNC/AWAIT
// ==========================
public_users.get('/async/isbn/:isbn', async function (req, res) {

    try {

        const isbn = req.params.isbn;

        const response = await axios.get(
            `${BASE_URL}/isbn/${isbn}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching book by ISBN"
        });
    }
});


// ==========================
// TASK 12 - GET BOOKS BY AUTHOR USING ASYNC/AWAIT
// ==========================
public_users.get('/async/author/:author', async function (req, res) {

    try {

        const author = req.params.author;

        const response = await axios.get(
            `${BASE_URL}/author/${author}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by author"
        });
    }
});


// ==========================
// TASK 13 - GET BOOKS BY TITLE USING ASYNC/AWAIT
// ==========================
public_users.get('/async/title/:title', async function (req, res) {

    try {

        const title = req.params.title;

        const response = await axios.get(
            `${BASE_URL}/title/${title}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books by title"
        });
    }
});


module.exports.general = public_users;