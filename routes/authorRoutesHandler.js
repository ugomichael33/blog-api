const express = require('express');
const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
} = require('../controllers/authorController');

const router = express.Router();


router.route('/')
    .get(getAllAuthors)
    .post(createAuthor);


router.route('/:id')
    .get(getAuthorById)
    .put(updateAuthor)
    .delete(deleteAuthor);

module.exports = router;