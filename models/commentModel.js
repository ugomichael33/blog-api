const { getDb } = require('../config/firebaseConfig');
const { FieldValue } = require('@google-cloud/firestore');

let commentsCollection;
let blogsCollection;

const initDb = async () => {
    const db = await getDb();
    commentsCollection = db.collection('comments');
    blogsCollection = db.collection('blogs');
};

const verifyDocumentExists = async (collection, id, errorMsg) => {
    const doc = await collection.doc(id).get();
    if (!doc.exists) throw new Error(errorMsg);
    return doc;
};

const verifyNonEmptyField = (data, field, errorMsg) => {
    if (field in data) {
        if (field === 'userInfo') {
            if (typeof data[field] !== "object" || !data[field].username || !data[field].email) {
                throw new Error(errorMsg);
            }
        } else if (field === 'content') {
            if (typeof data[field] !== "string" || data[field].trim() === '') {
                throw new Error(errorMsg);
            }
        }
    }
};

const createComment = async (commentData) => {
    if (!commentsCollection || !blogsCollection) await initDb();

    const { blogId, userInfo, commentText } = commentData;

    verifyNonEmptyField(commentData, 'blogId', 'Comment must be associated with a blog');
    await verifyDocumentExists(blogsCollection, blogId, 'Associated blog not found');

    verifyNonEmptyField(commentData, userInfo, 'User information is required for a comment');
    verifyNonEmptyField(commentData, commentText, 'Comment content cannot be empty');

    commentData.createdAt = FieldValue.serverTimestamp();
    commentData.updatedAt = FieldValue.serverTimestamp();

    const docRef = await commentsCollection.add(commentData);
    return docRef.id;
};

const getCommentsByBlogId = async (blogId, limit = 10, startAfterId = null) => {
    if (!commentsCollection || !blogsCollection) await initDb();

    await verifyDocumentExists(blogsCollection, blogId, 'Blog not found');
    
    let query = commentsCollection.where('blogId', '==', blogId).orderBy('createdAt', 'desc').limit(limit);
    if (startAfterId) {
        const startAfterDoc = await commentsCollection.doc(startAfterId).get();
        query = query.startAfter(startAfterDoc);
    }
    
    const snapshot = await query.get();
    return snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateComment = async (id, updatedData) => {
    if (!commentsCollection) await initDb();

    await verifyDocumentExists(commentsCollection, id, 'Comment not found');
    verifyNonEmptyField(updatedData, 'content', 'Comment content cannot be empty');

    updatedData.updatedAt = FieldValue.serverTimestamp();

    await commentsCollection.doc(id).update(updatedData);
};

const deleteComment = async (id) => {
    if (!commentsCollection) await initDb();

    await verifyDocumentExists(commentsCollection, id, 'Comment not found');
    
    await commentsCollection.doc(id).update({
        isDeleted: true,
        deletedAt: FieldValue.serverTimestamp()
    });
};

module.exports = {
    createComment,
    getCommentsByBlogId,
    updateComment,
    deleteComment
};
