const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: Number,
    genre: String,
    poster: String,
    watchUrl: String,
    downloadUrl: String,
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// API Routes
// Get all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ pinned: -1, createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.query;
        const movies = await Movie.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        }).sort({ pinned: -1, createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error searching movies' });
    }
});

// Filter by genre
app.get('/api/movies/genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.find({ genre }).sort({ pinned: -1, createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Error filtering movies' });
    }
});

// Add new movie
app.post('/api/movies', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: 'Error adding movie' });
    }
});

// Update movie
app.put('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(movie);
    } catch (error) {
        res.status(400).json({ error: 'Error updating movie' });
    }
});

// Delete movie
app.delete('/api/movies/:id', async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting movie' });
    }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
