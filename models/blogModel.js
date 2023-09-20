const { getDb } = require('../config/firebaseConfig');

const admin = require('firebase-admin');

let blogsCollection;
let authorsCollection;

const initDb = async () => {
    const db = await getDb();
    blogsCollection = db.collection('blogs');
    authorsCollection = db.collection('authors');
};

async function verifyDocumentExists(collection, documentId, errorMessage) {

  const documentSnapshot = await collection.doc(documentId).get();
  
  if (!documentSnapshot.exists) {
      throw new Error(errorMessage);
  }
  return documentSnapshot; 
}

const verifyNonEmptyField = (data, field, errorMsg) => {
  if (field in data && (!data[field] || data[field].trim() === '')) {
      throw new Error(errorMsg);
  }
};

const createBlog = async (blogData) => {
  if (!blogsCollection || !authorsCollection) await initDb();
  
  for (let authorId of blogData.authors) {
    await verifyDocumentExists(authorsCollection, authorId, 'Author does not exist');
  }

  verifyNonEmptyField(blogData, 'title', 'Title cannot be empty');
  verifyNonEmptyField(blogData, 'content', 'Content cannot be empty');
  
  const docRef = await blogsCollection.add(blogData);
  return docRef.id;
};


const getAllBlogs = async () => {
    if (!blogsCollection) await initDb();

    const snapshot = await blogsCollection.get();
    return snapshot.empty ? [] : snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getBlogById = async (id) => {
    if (!blogsCollection) await initDb();

    const blog = await verifyDocumentExists(blogsCollection, id, 'Blog not found');
    return { id: blog.id, ...blog.data() };
};

const updateBlog = async (id, updatedData) => {
  if (!blogsCollection || !authorsCollection) await initDb();

  await verifyDocumentExists(blogsCollection, id, 'Blog not found');
  verifyNonEmptyField(updatedData, 'title', 'Title cannot be empty');
  verifyNonEmptyField(updatedData, 'content', 'Content cannot be empty');

  if(updatedData.authors && Array.isArray(updatedData.authors)) { 
      for (let authorId of updatedData.authors) {
          await verifyDocumentExists(authorsCollection, authorId, 'Author does not exist');
      }
  }

  await blogsCollection.doc(id).update(updatedData);
};


const incrementBlogLikes = async (blogId) => {
  if (!blogsCollection) await initDb();

  const blogRef = blogsCollection.doc(blogId);
  await blogRef.update({ likes: admin.firestore.FieldValue.increment(1) });
};

const incrementBlogViews = async (blogId) => {
  if (!blogsCollection) await initDb();

  const blogRef = blogsCollection.doc(blogId);
  await blogRef.update({ views: admin.firestore.FieldValue.increment(1) });
};

const deleteBlog = async (id) => {
    if (!blogsCollection) await initDb();

    await verifyDocumentExists(blogsCollection, id, 'Blog not found');
    await blogsCollection.doc(id).delete();
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    incrementBlogLikes,
    incrementBlogViews
};
