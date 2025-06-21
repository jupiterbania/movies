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
    genres: [String], // Changed from single genre to array of genres
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24; // Changed to 24
        const skip = (page - 1) * limit;

        const totalMovies = await Movie.countDocuments();
        const totalPages = Math.ceil(totalMovies / limit);
        
        const movies = await Movie.find()
            .sort({ pinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            movies,
            currentPage: page,
            totalPages,
            totalMovies
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// Search movies
app.get('/api/movies/search', async (req, res) => {
    try {
        const query = req.query.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24; // Changed to 24
        const skip = (page - 1) * limit;

        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { genres: { $regex: query, $options: 'i' } }
            ]
        };

        const totalMovies = await Movie.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalMovies / limit);

        const movies = await Movie.find(searchQuery)
            .sort({ pinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            movies,
            currentPage: page,
            totalPages,
            totalMovies
        });
    } catch (error) {
        res.status(500).json({ error: 'Error searching movies' });
    }
});

// Filter by genre
app.get('/api/movies/genre/:genre', async (req, res) => {
    try {
        const genre = req.params.genre;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24; // Changed to 24
        const skip = (page - 1) * limit;

        const query = genre === 'All' ? {} : { genres: genre };
        const totalMovies = await Movie.countDocuments(query);
        const totalPages = Math.ceil(totalMovies / limit);

        const movies = await Movie.find(query)
            .sort({ pinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            movies,
            currentPage: page,
            totalPages,
            totalMovies
        });
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
        const updateData = {
            ...req.body,
            createdAt: new Date() // Ensure createdAt is updated
        };
        
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updateData,
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
