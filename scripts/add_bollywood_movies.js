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

// Bollywood movies data (recent and upcoming)
const bollywoodMovies = [
    {
        title: "Fighter",
        year: 2024,
        rating: 8.5,
        genre: "Action",
        poster: "https://m.media-amazon.com/images/M/MV5BMDk2YzFhNTctZjUyNC00NzQxLWIwYjEtYmFhZjY0ZWNiZTY4XkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt11762798/",
        featured: true,
        pinned: true
    },
    {
        title: "Dunki",
        year: 2024,
        rating: 8.2,
        genre: "Comedy Drama",
        poster: "https://m.media-amazon.com/images/M/MV5BMzQ0NDRhNmItYzllYS00NDdlLTk0YTctZjk5NjJkZGI4NWRlXkEyXkFqcGdeQXVyNTYwMzA0MTM@._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt15428134/",
        featured: true,
        pinned: true
    },
    {
        title: "Animal",
        year: 2024,
        rating: 8.7,
        genre: "Action Drama",
        poster: "https://m.media-amazon.com/images/M/MV5BNGViZTY1YTYtMjk3Zi00YTgyLWFhNTYtZDAyYjNlNjY5NjJhXkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt13751694/",
        featured: true
    },
    {
        title: "12th Fail",
        year: 2024,
        rating: 9.1,
        genre: "Drama",
        poster: "https://m.media-amazon.com/images/M/MV5BOTJlY2U2NTYtZTc5Yi00ZDY0LWJiMjktMGNhZmNkNjc5NzE5XkEyXkFqcGdeQXVyMTYzMzM5OTU2._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt23849204/",
        featured: true
    },
    {
        title: "Salaar",
        year: 2024,
        rating: 8.3,
        genre: "Action",
        poster: "https://m.media-amazon.com/images/M/MV5BMmU2NzJmZmUtZjBjMS00ZTYxLWI4OTEtNmVkZjU3ZWYxYjEzXkEyXkFqcGdeQXVyMTUzNTgzNzM0._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt13927658/",
        featured: true
    },
    {
        title: "Singham Again",
        year: 2024,
        rating: 8.0,
        genre: "Action",
        poster: "https://m.media-amazon.com/images/M/MV5BZjY5MTU5ZjctZjc4NS00MTY5LWE2YmYtOGY4YzA4YjBkYzY5XkEyXkFqcGdeQXVyNTYwMzA0MTM@._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt15428134/",
        featured: true
    },
    {
        title: "Welcome To The Jungle",
        year: 2024,
        rating: 7.8,
        genre: "Comedy",
        poster: "https://m.media-amazon.com/images/M/MV5BYTNhNWRmODEtMzg5Mi00ZjkwLWI5YTEtNzE5YzEwMDVmZDQ5XkEyXkFqcGdeQXVyMTU0ODI1NTA2._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt27145269/",
        featured: true
    },
    {
        title: "Yodha",
        year: 2024,
        rating: 7.9,
        genre: "Action Thriller",
        poster: "https://m.media-amazon.com/images/M/MV5BZGJhNDdmMWYtYjFlNi00NDRkLTk5ZTYtZDc5ZTk3MTRmOTFkXkEyXkFqcGdeQXVyMTQ3Mzk2MDg4._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt15301048/",
        featured: true
    },
    {
        title: "Bade Miyan Chote Miyan",
        year: 2024,
        rating: 8.1,
        genre: "Action",
        poster: "https://m.media-amazon.com/images/M/MV5BZTNjZDZlMGYtZGY5ZS00ZjE2LWJlYmUtMGU1MmM4MmM5ZWY3XkEyXkFqcGdeQXVyMTU0ODI1NTA2._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt15163652/",
        featured: true
    },
    {
        title: "Stree 2",
        year: 2024,
        rating: 8.0,
        genre: "Horror Comedy",
        poster: "https://m.media-amazon.com/images/M/MV5BYjY5ZjY5ZDgtNDY5Ni00YzYxLTkzNjUtYTU2ZTU1MjM2ZmFiXkEyXkFqcGdeQXVyMTU0ODI1NTA2._V1_.jpg",
        redirectUrl: "https://www.imdb.com/title/tt27145269/",
        featured: true
    }
];

// First, remove all existing movies
async function removeAllMovies() {
    try {
        await Movie.deleteMany({});
        console.log('All existing movies removed successfully');
    } catch (error) {
        console.error('Error removing existing movies:', error);
    }
}

// Function to add a movie from our predefined list
async function addBollywoodMovie(movieData) {
    const movie = new Movie({
        ...movieData,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) // Random date within last 7 days
    });

    try {
        await movie.save();
        console.log(`Added movie: ${movie.title} (${movie.year})`);
    } catch (error) {
        console.error(`Error adding movie ${movie.title}:`, error);
    }
}

// Main function to remove old movies and add new Bollywood movies
async function updateMovies() {
    console.log('Starting to update movie database...');
    
    try {
        // First remove all existing movies
        await removeAllMovies();
        
        // Add all predefined Bollywood movies
        const promises = bollywoodMovies.map(movie => addBollywoodMovie(movie));
        await Promise.all(promises);
        
        console.log('Successfully updated movie database with new Bollywood movies!');
    } catch (error) {
        console.error('Error updating movies:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Run the script
updateMovies(); 