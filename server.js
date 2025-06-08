const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wwwrohanbania009:rOXgaMbvNrNSSfdj@cinemabuzz.g3vejvo.mongodb.net/cinemabuzz?retryWrites=true&w=majority&appName=CinemaBuzz';
const NODE_ENV = process.env.NODE_ENV || 'development';

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
    
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        initializeData();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
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
                    title: "Oppenheimer",
                    year: 2023,
                    rating: 8.4,
                    genre: "Biography",
                    poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt15398776/",
                    featured: true
                },
                {
                    title: "Barbie",
                    year: 2023,
                    rating: 7.0,
                    genre: "Comedy",
                    poster: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1517268/",
                    featured: true
                },
                {
                    title: "Spider-Man: Across the Spider-Verse",
                    year: 2023,
                    rating: 8.7,
                    genre: "Animation",
                    poster: "https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt9362722/",
                    featured: true
                },
                {
                    title: "Dune",
                    year: 2021,
                    rating: 8.0,
                    genre: "Sci-Fi",
                    poster: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1160419/",
                    featured: true
                },
                {
                    title: "Everything Everywhere All at Once",
                    year: 2022,
                    rating: 7.9,
                    genre: "Action",
                    poster: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt6710474/",
                    featured: true
                },
                {
                    title: "Top Gun: Maverick",
                    year: 2022,
                    rating: 8.3,
                    genre: "Action",
                    poster: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1745960/",
                    featured: true
                },
                {
                    title: "The Batman",
                    year: 2022,
                    rating: 7.8,
                    genre: "Action",
                    poster: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1877830/",
                    featured: false
                },
                {
                    title: "Avatar: The Way of Water",
                    year: 2022,
                    rating: 7.6,
                    genre: "Sci-Fi",
                    poster: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt1630029/",
                    featured: true
                },
                {
                    title: "RRR",
                    year: 2022,
                    rating: 7.8,
                    genre: "Action",
                    poster: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt8178634/",
                    featured: true
                },
                {
                    title: "The Whale",
                    year: 2022,
                    rating: 7.7,
                    genre: "Drama",
                    poster: "https://m.media-amazon.com/images/M/MV5BZDQ4Njg4YTctNGZkYi00NWU1LWI4OTYtNmNjOWMyMjI1NWYzXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg",
                    redirectUrl: "https://www.imdb.com/title/tt13833688/",
                    featured: false
                }
            ];
            await Movie.insertMany(sampleMovies, { ordered: false });
            console.log('Sample data initialized with recent popular movies');
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
        // Validate required fields
        const { title, year, rating, genre, poster, redirectUrl } = req.body;
        if (!title || !year || !rating || !genre || !poster || !redirectUrl) {
            return res.status(400).json({ 
                message: 'Error adding movie', 
                error: 'All fields are required' 
            });
        }

        // Create new movie with validated data
        const movie = new Movie({
            title,
            year: parseInt(year),
            rating: parseFloat(rating),
            genre,
            poster,
            redirectUrl,
            featured: req.body.featured || false
        });

        const savedMovie = await movie.save();
        // Clear cache when new movie is added
        cache.clear();
        res.status(201).json(savedMovie);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(400).json({ 
            message: 'Error adding movie', 
            error: error.message || 'Failed to add movie'
        });
    }
});

// Delete movie route
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Movie.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Clear cache when movie is deleted
        cache.clear();
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Error deleting movie', error: error.message });
    }
});

// Update movie route
app.put('/api/movies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Movie.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!result) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Clear cache when movie is updated
        cache.clear();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Error updating movie', error: error.message });
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
