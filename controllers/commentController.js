const { 
    createComment: create,
    getCommentsByBlogId: getByBlog,
    updateComment: update,
    deleteComment: deleteById 
} = require('../models/commentModel');

const respond = (res, status, data) => res.status(status).json(data);
const handleError = (res, error) => res.status(500).json({ error: error.message });

const createComment = async (req, res) => {
    try {
        const { blogId, userInfo, commentText } = req.body;
        if (!commentText || commentText.trim() === '') {
            handleError(res, new Error('Comment text cannot be empty'), 400);
            return;
        }
        const commentId = await create({ blogId, userInfo, commentText });
        respond(res, 201, { commentId });
    } catch (error) {
        handleError(res, error);
    }
};

const getCommentsByBlogId = async (req, res) => {
    try {
        const comments = await getByBlog(req.params.blogId);
        respond(res, 200, { comments });
    } catch (error) {
        handleError(res, error);
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentText } = req.body;
        if (!commentText || commentText.trim() === '') {
            handleError(res, new Error('Comment text cannot be empty'), 400);
            return;
        }
        
        await update(req.params.id, { commentText });
        respond(res, 200, { message: 'Comment updated successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteComment = async (req, res) => {
    try {
        await deleteById(req.params.id);
        respond(res, 200, { message: 'Comment deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    createComment,
    getCommentsByBlogId,
    updateComment,
    deleteComment
};
