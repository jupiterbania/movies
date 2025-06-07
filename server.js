const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ledosportsacademy:KYbsTxWjVBvPnREP@ledosportsacademy.ejcd06z.mongodb.net/cinemabuzz?retryWrites=true&w=majority&appName=ledosportsacademy';

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection with optimized settings
const connectWithRetry = () => {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };

    mongoose.connect(MONGODB_URI, options)
        .then(() => {
            console.log('Connected to MongoDB Atlas');
            initializeData();
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Retrying in 3 seconds...');
            setTimeout(connectWithRetry, 3000);
        });
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Handle application shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

connectWithRetry();

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: Number,
    genre: String,
    poster: String,
    redirectUrl: String,
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { 
    timestamps: false,
    strict: false
});

const Movie = mongoose.model('Movie', movieSchema);

// Initialize with sample data if empty
async function initializeData() {
    try {
        const count = await Movie.countDocuments();
        if (count === 0) {
            const sampleMovies = [
                {
                    title: "Inception",
                    year: 2010,
                    rating: 8.8,
                    genre: "Sci-Fi",
                    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1375666/",
                    featured: true
                },
                {
                    title: "The Dark Knight",
                    year: 2008,
                    rating: 9.0,
                    genre: "Action",
                    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt0468569/",
                    featured: true
                }
            ];
            await Movie.insertMany(sampleMovies, { ordered: false });
            console.log('Sample data initialized');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function for caching
const withCache = (key, ttl, fetchData) => async (req, res) => {
    const cacheKey = `${key}-${JSON.stringify(req.params)}-${JSON.stringify(req.query)}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && cached.timestamp + ttl > now) {
        return res.json(cached.data);
    }

    try {
        const data = await fetchData(req);
        cache.set(cacheKey, { timestamp: now, data });
        res.json(data);
    } catch (error) {
        console.error(`Error in ${key}:`, error);
        res.status(500).json({ message: `Error in ${key}`, error: error.message });
    }
};

// Routes
app.get('/api/movies', withCache('all-movies', CACHE_DURATION, async () => {
    return await Movie.find().select('-__v').lean().limit(50);
}));

app.get('/api/movies/search', withCache('search-movies', CACHE_DURATION, async (req) => {
    const { query } = req.query;
    return await Movie.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { genre: { $regex: query, $options: 'i' } }
        ]
    }).select('-__v').lean().limit(50);
}));

app.get('/api/movies/genre/:genre', withCache('genre-movies', CACHE_DURATION, async (req) => {
    const { genre } = req.params;
    return await Movie.find({ genre }).select('-__v').lean().limit(50);
}));

app.get('/api/movies/letter/:letter', withCache('letter-movies', CACHE_DURATION, async (req) => {
    const { letter } = req.params;
    return await Movie.find({
        title: { $regex: `^${letter}`, $options: 'i' }
    }).select('-__v').lean().limit(50);
}));

app.post('/api/movies', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        const savedMovie = await movie.save();
        // Clear cache when new movie is added
        cache.clear();
        res.status(201).json(savedMovie);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(400).json({ message: 'Error adding movie', error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
