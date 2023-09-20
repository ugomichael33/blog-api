const express = require('express');
const dotenv = require('dotenv');

const authorRoutes = require('./routes/authorRoutesHandler');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/authors', authorRoutes);
app.use('/blogs', blogRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Blogging Platform API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
