const express = require('express');
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    incrementLikes,
    incrementViews
} = require('../controllers/blogController');

const router = express.Router();


router.route('/')
    .get(getAllBlogs)
    .post(createBlog);


router.route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog);

router.route('/:id/like').post(incrementLikes);
router.route('/:id/view').post(incrementViews);

module.exports = router;
