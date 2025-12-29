const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config(); 
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Atlas Connection Error:', err));
// CHANGE 1: Update the Schema
// You must add 'content' and 'status' so Mongoose allows the AI data to be saved
const Article = mongoose.model('Article', new mongoose.Schema({
    title: String, 
    link: String, 
    date: String, 
    author: String,
    content: String, // <--- ADDED: To store the LLM generated article
    status: String   // <--- ADDED: To track if it's "Updated"
}));

// CRUD APIs
app.get('/api/articles', async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

app.post('/api/articlespost', async (req, res) => {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.json(newArticle);
});

// CHANGE 2: Refine the PUT API
// This is what your Phase 2 script calls to "Publish" the new article
app.put('/api/articlesupdate/:id', async (req, res) => {
    try {
        const updated = await Article.findByIdAndUpdate(
            req.params.id, 
            req.body, // This now includes the 'content' field from your script
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update article" });
    }
});

app.delete('/api/articlesdelete/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log('Server running on port 5000'));