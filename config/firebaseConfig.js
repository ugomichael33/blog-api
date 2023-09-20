const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

let db;

const initializeFirebase = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        db = admin.firestore();
    }

    return db;
};

initializeFirebase();

const getDb = async () => {
    if (!db) {
        await initializeFirebase();
    }
    return db;
};

module.exports = { getDb };
