const { getDb } = require('../config/firebaseConfig');

let authorsCollection;
let blogsCollection;

const initDb = async () => {
    const db = await getDb();
    authorsCollection = db.collection('authors');
    blogsCollection = db.collection('blogs');
};

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/;

const verifyDocumentExists = async (collection, id, errorMsg) => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) throw new Error(errorMsg);
    return doc;
};

const verifyNonEmptyField = (data, field, errorMsg) => {
    if (field in data && (!data[field] || data[field].trim() === '')) {
        throw new Error(errorMsg);
    }
};

const createAuthor = async (authorData) => {
    if (!authorsCollection) await initDb();

    verifyNonEmptyField(authorData, 'fullName', 'Full name is required');
    verifyNonEmptyField(authorData, 'email', 'A valid email is required');

    if (!EMAIL_REGEX.test(authorData.email)) {
        throw new Error('A valid email is required');
    }

    const snapshot = await authorsCollection.where('email', '==', authorData.email).get();
    if (!snapshot.empty) {
        throw new Error('Email already in use');
    }

    const docRef = await authorsCollection.add(authorData);
    return docRef.id;
};

const getAllAuthors = async () => {
    if (!authorsCollection) await initDb();

    const snapshot = await authorsCollection.get();
    return snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAuthorById = async (id) => {
    if (!authorsCollection) await initDb();

    const author = await verifyDocumentExists(authorsCollection, id, 'Author not found');
    return { id: author.id, ...author.data() };
};

const updateAuthor = async (id, updatedData) => {
    if (!authorsCollection) await initDb();

    verifyNonEmptyField(updatedData, 'fullName', 'Full name cannot be empty');

    if ('email' in updatedData) {
        if (!EMAIL_REGEX.test(updatedData.email)) {
            throw new Error('A valid email is required');
        }

        const snapshot = await authorsCollection.where('email', '==', updatedData.email).get();
        if (!snapshot.empty && snapshot.docs[0].id !== id) {
            throw new Error('Email already in use by another author');
        }
    }

    await authorsCollection.doc(id).update(updatedData);
};

const deleteAuthor = async (id) => {
    if (!authorsCollection) await initDb();

    const associatedBlogs = await blogsCollection.where('authors', 'array-contains', id).get();
    if (!associatedBlogs.empty) {
        throw new Error('Cannot delete author. They have associated blogs.');
    }

    await authorsCollection.doc(id).delete();
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor
};
