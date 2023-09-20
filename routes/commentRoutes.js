const express = require('express');
const {
    createComment,
    getCommentsByBlogId,
    updateComment,
    deleteComment
} = require('../controllers/commentController.js');

const router = express.Router();

router.route('/')
    .post(createComment);

router.route('/blog/:blogId')
    .get(getCommentsByBlogId);

router.route('/:id')
    .put(updateComment)
    .delete(deleteComment);

module.exports = router;
