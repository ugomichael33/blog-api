const { 
    createBlog: create,
    getAllBlogs: getAll,
    getBlogById: getById,
    updateBlog: update,
    deleteBlog: deleteById,
    incrementBlogLikes,
    incrementBlogViews
} = require('../models/blogModel');

const respond = (res, status, data) => res.status(status).json(data);
const handleError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message })
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await getAll();
        respond(res, 200, { blogs });
    } catch (error) {
        handleError(res, error);
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await getById(req.params.id);
        respond(res, 200, { blog });
    } catch (error) {
        handleError(res, error);
    }
};

const createBlog = async (req, res) => {
    try {
        const { title, content, authors } = req.body;
        const blogId = await create({ title, content, authors });
        respond(res, 201, { blogId });
    } catch (error) {
        handleError(res, error);
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        const updates = {};

        if (title && title.trim() !== '') updates.title = title;
        if (content && content.trim() !== '') updates.content = content;
        if (author) updates.author = author;

        await update(req.params.id, updates);
        respond(res, 200, { message: 'Blog updated successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const incrementLikes = async (req, res) => {
    try {
        await incrementBlogLikes(req.params.id);
        respond(res, 200, { message: 'Blog likes incremented successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const incrementViews = async (req, res) => {
    try {
        await incrementBlogViews(req.params.id);
        respond(res, 200, { message: 'Blog views incremented successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteBlog = async (req, res) => {
    try {
        await deleteById(req.params.id);
        respond(res, 200, { message: 'Blog deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    incrementLikes,
    incrementViews
};
