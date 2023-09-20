const { 
    createAuthor: create,
    getAllAuthors: getAll,
    getAuthorById: getById,
    updateAuthor: update,
    deleteAuthor: deleteById 
} = require('../models/authorModel');

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/;

const respond = (res, status, data) => res.status(status).json(data);
const handleError = (res, error, status = 500) => res.status(status).json({ error: error.message });

const getAllAuthors = async (req, res) => {
    try {
        const authors = await getAll();
        respond(res, 200, { authors });
    } catch (error) {
        handleError(res, error);
    }
};

const getAuthorById = async (req, res) => {
    try {
        const author = await getById(req.params.id);
        
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        respond(res, 200, { author });
    } catch (error) {
        if (error.message === 'Author not found') {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        handleError(res, error);
    }
};


const createAuthor = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || fullName.trim() === '') {
            return handleError(res, new Error('Full name is required'), 400);
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            return handleError(res, new Error('A valid email is required'), 400);
        }

        const authorId = await create({ fullName, email });
        respond(res, 201, { authorId });
    } catch (error) {
        handleError(res, error);
    }
};

const updateAuthor = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || fullName.trim() === '') {
            return handleError(res, new Error('Full name is required'), 400);
        }

        if (email && !EMAIL_REGEX.test(email)) {
            return handleError(res, new Error('A valid email is required'), 400);
        }

        await update(req.params.id, { fullName, email });
        respond(res, 200, { message: 'Author updated successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteAuthor = async (req, res) => {
    try {
        await deleteById(req.params.id);
        respond(res, 200, { message: 'Author deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};
