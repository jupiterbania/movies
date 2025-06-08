const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wwwrohanbania009:rOXgaMbvNrNSSfdj@cinemabuzz.g3vejvo.mongodb.net/?retryWrites=true&w=majority&appName=CinemaBuzz', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: Number,
    genre: String,
    poster: String,
    redirectUrl: String,
    featured: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// Sample data for random generation
const sampleData = {
    genres: ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War'],
    movieTitles: [
        'The Last Stand', 'Midnight Echo', 'Rising Sun', 'Dark Waters', 'Lost Paradise',
        'The Hidden Truth', 'Eternal Light', 'Breaking Point', 'Silent Storm', 'Beyond Tomorrow',
        'The Final Chapter', 'Forgotten Dreams', 'Shadow Walker', 'Time Travelers', 'Ocean\'s Heart',
        'The Secret Garden', 'Night Sky', 'Morning Star', 'The Lost City', 'Brave Hearts',
        'Desert Storm', 'Mountain Peak', 'River Flow', 'The Great Journey', 'Wild Spirit',
        'Golden Dawn', 'Silver Moon', 'Crystal Lake', 'The Iron Mask', 'Fire and Ice',
        'The Last Hope', 'First Light', 'Dark Matter', 'The Awakening', 'Destiny\'s Call',
        'The Prophecy', 'Ancient Secrets', 'Modern Times', 'Future Shock', 'Past Lives',
        'The Wanderer', 'Lost Souls', 'Heaven\'s Gate', 'Hell\'s Kitchen', 'Paradise Found',
        'The Quest', 'Journey Home', 'Far Away', 'Close Call', 'The Mission'
    ],
    adjectives: [
        'Lost', 'Hidden', 'Secret', 'Mysterious', 'Dark', 'Light', 'Ancient', 'Modern',
        'Eternal', 'Final', 'First', 'Last', 'Great', 'Little', 'New', 'Old', 'Rising',
        'Falling', 'Breaking', 'Mending', 'Wild', 'Tame', 'Free', 'Bound', 'Silent'
    ],
    nouns: [
        'Kingdom', 'Empire', 'World', 'City', 'Land', 'Planet', 'Galaxy', 'Universe',
        'Dream', 'Nightmare', 'Reality', 'Fantasy', 'Truth', 'Lie', 'Secret', 'Mystery',
        'Journey', 'Quest', 'Adventure', 'Story', 'Tale', 'Legend', 'Myth', 'Saga', 'Epic'
    ]
};

// Function to generate a random movie title
function generateMovieTitle() {
    const random = Math.random();
    if (random < 0.3) {
        // Format: The + Adjective + Noun
        return `The ${sampleData.adjectives[Math.floor(Math.random() * sampleData.adjectives.length)]} ${
            sampleData.nouns[Math.floor(Math.random() * sampleData.nouns.length)]}`;
    } else if (random < 0.6) {
        // Use pre-defined title
        return sampleData.movieTitles[Math.floor(Math.random() * sampleData.movieTitles.length)];
    } else {
        // Format: Adjective + Noun
        return `${sampleData.adjectives[Math.floor(Math.random() * sampleData.adjectives.length)]} ${
            sampleData.nouns[Math.floor(Math.random() * sampleData.nouns.length)]}`;
    }
}

// Function to generate a random year between 1990 and current year
function generateYear() {
    const currentYear = new Date().getFullYear();
    return Math.floor(Math.random() * (currentYear - 1990 + 1)) + 1990;
}

// Function to generate a random rating between 5.0 and 9.5
function generateRating() {
    return Number((Math.random() * (9.5 - 5.0) + 5.0).toFixed(1));
}

// Function to generate a random poster URL
function generatePosterUrl() {
    const width = 300;
    const height = 450;
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${randomId}/${width}/${height}`;
}

// Function to generate a random IMDB-like URL
function generateRedirectUrl() {
    const randomId = Math.random().toString(36).substring(2, 10);
    return `https://www.imdb.com/title/tt${randomId}/`;
}

// Function to create a random movie
async function createRandomMovie() {
    const movie = new Movie({
        title: generateMovieTitle(),
        year: generateYear(),
        rating: generateRating(),
        genre: sampleData.genres[Math.floor(Math.random() * sampleData.genres.length)],
        poster: generatePosterUrl(),
        redirectUrl: generateRedirectUrl(),
        featured: Math.random() < 0.2, // 20% chance to be featured
        pinned: Math.random() < 0.1, // 10% chance to be pinned
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
    });

    try {
        await movie.save();
        console.log(`Added movie: ${movie.title}`);
    } catch (error) {
        console.error(`Error adding movie ${movie.title}:`, error);
    }
}

// Main function to add 100 random movies
async function addRandomMovies() {
    console.log('Starting to add random movies...');
    
    try {
        // Create 100 random movies
        const promises = Array(100).fill().map(() => createRandomMovie());
        await Promise.all(promises);
        
        console.log('Successfully added 100 random movies!');
    } catch (error) {
        console.error('Error adding movies:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Run the script
addRandomMovies(); 