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

// Sample Marathi movie data
const marathiMovies = [
    {
        title: "Baipan Bhari Deva",
        year: 2024,
        rating: 8.5,
        genre: "Drama",
        poster: "https://i.imgur.com/YVGKVeD.jpg"
    },
    {
        title: "Ghar Banduk Biryani",
        year: 2024,
        rating: 8.2,
        genre: "Action",
        poster: "https://i.imgur.com/1XK7O8L.jpg"
    },
    {
        title: "Vicky Velingkar Returns",
        year: 2024,
        rating: 7.9,
        genre: "Thriller",
        poster: "https://i.imgur.com/QZ4JRnH.jpg"
    },
    {
        title: "Sunny",
        year: 2024,
        rating: 8.0,
        genre: "Drama",
        poster: "https://i.imgur.com/mP8Qp1k.jpg"
    },
    {
        title: "Gadad Andhar",
        year: 2024,
        rating: 8.3,
        genre: "Mystery",
        poster: "https://i.imgur.com/L2NKpxM.jpg"
    }
];

// Marathi name components for generating random movie titles
const marathiNames = {
    prefixes: [
        'Mi', 'Tu', 'Amhi', 'Tumhi', 'Aapan', 'Majha', 'Tujha', 'Aamcha', 'Tumcha', 'Aapla',
        'Ek', 'Don', 'Teen', 'Char', 'Paach', 'Saha', 'Saat', 'Aath', 'Nav', 'Daha'
    ],
    words: [
        'Premachi', 'Gavachi', 'Marathmoli', 'Gadbad', 'Dhamaal', 'Rangila', 'Dhingana',
        'Zapatlela', 'Timepass', 'Khurchi', 'Varhadi', 'Mulshi', 'Pawri', 'Dhingana',
        'Vajleli', 'Katta', 'Ghanta', 'Dhinchak', 'Zingaat', 'Jhingaat'
    ],
    suffixes: [
        'Katha', 'Goshta', 'Kahani', 'Sakhi', 'Gaani', 'Express', 'Local', 'Pattern',
        'Style', 'Masala', 'Tadka', 'Dhamaka', 'Pathak', 'Patil', 'Pawar', 'Shinde'
    ]
};

// Function to generate a random Marathi movie title
function generateMarathiTitle() {
    const useRealTitle = Math.random() < 0.3; // 30% chance to use a real title
    
    if (useRealTitle && marathiMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * marathiMovies.length);
        return marathiMovies[randomIndex].title;
    }

    const prefix = marathiNames.prefixes[Math.floor(Math.random() * marathiNames.prefixes.length)];
    const word = marathiNames.words[Math.floor(Math.random() * marathiNames.words.length)];
    const suffix = marathiNames.suffixes[Math.floor(Math.random() * marathiNames.suffixes.length)];

    const titleFormat = Math.random();
    if (titleFormat < 0.33) {
        return `${prefix} ${word}`;
    } else if (titleFormat < 0.66) {
        return `${word} ${suffix}`;
    } else {
        return `${prefix} ${suffix}`;
    }
}

// Function to generate a random year (2024 or 2025)
function generateYear() {
    return Math.random() < 0.6 ? 2024 : 2025; // 60% chance for 2024
}

// Function to generate a random rating between 7.0 and 9.5 (for popular movies)
function generateRating() {
    return Number((Math.random() * (9.5 - 7.0) + 7.0).toFixed(1));
}

// Marathi movie genres
const marathiGenres = [
    'Drama', 'Comedy', 'Romance', 'Action', 'Family', 'Social',
    'Historical', 'Thriller', 'Musical', 'Biography'
];

// Function to generate a random poster URL (using movie-themed images)
function generatePosterUrl() {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/marathi${randomId}/300/450`;
}

// Function to create a random Marathi movie
async function createRandomMarathiMovie() {
    const movie = new Movie({
        title: generateMarathiTitle(),
        year: generateYear(),
        rating: generateRating(),
        genre: marathiGenres[Math.floor(Math.random() * marathiGenres.length)],
        poster: generatePosterUrl(),
        redirectUrl: `https://www.imdb.com/title/tt${Math.random().toString(36).substring(2, 10)}/`,
        featured: Math.random() < 0.3, // 30% chance to be featured
        pinned: Math.random() < 0.15, // 15% chance to be pinned
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000) // Random date within last 15 days
    });

    try {
        await movie.save();
        console.log(`Added Marathi movie: ${movie.title} (${movie.year})`);
    } catch (error) {
        console.error(`Error adding movie ${movie.title}:`, error);
    }
}

// Main function to add 50 Marathi movies
async function addMarathiMovies() {
    console.log('Starting to add Marathi movies...');
    
    try {
        // Create 50 random Marathi movies
        const promises = Array(50).fill().map(() => createRandomMarathiMovie());
        await Promise.all(promises);
        
        console.log('Successfully added 50 Marathi movies!');
    } catch (error) {
        console.error('Error adding movies:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

// Run the script
addMarathiMovies(); 