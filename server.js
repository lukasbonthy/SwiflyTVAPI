const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors module
const path = require('path');
const fs = require('fs');
const requestIp = require('request-ip');

const app = express();
const port = 3020;

// Use the CORS middleware globally
app.use(cors());

// Use the TMDb and YouTube API keys from the environment variable
const TMDB_API_KEY = process.env.API_KEY;
// Retrieve TMDb API key from environment variable
const tmdbApiKey = process.env.API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


if (!TMDB_API_KEY || !YOUTUBE_API_KEY) {
  console.error('TMDb API key or YouTube API key not provided. Please set the API keys in the environment variables.');
  process.exit(1);
}

// Serve the all.css file
app.get('/all.css', (req, res) => {
  // Read the contents of all.css
  fs.readFile('all.css', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading all.css:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    // Set the Content-Type header to text/css
    res.setHeader('Content-Type', 'text/css');
    // Send the contents of all.css
    res.send(data);
  });
});

app.get('/v3/m3u8/:id', (req, res) => {
    const movieId = req.params.id;
    const targetUrl = `https://play2.123embed.net/movie/${movieId}`;

    // Respond with the target URL
    res.json({ success: true, targetUrl });
});

app.get('/v3/m3u8/tv/:id/:season/:episode', (req, res) => {
    const { id, season, episode } = req.params;
    const targetUrl = `https://play2.123embed.net/server/3?path=/tv/${id}/${season}/${episode}`;

    // Respond with the target URL
    res.json({ success: true, targetUrl });
});


app.get('/v3/series', async (req, res) => {
  try {
    // Fetch genres for TV series
    const genresResponse = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en`);

    if (!genresResponse.data.genres) {
      throw new Error('Error fetching TV series genres');
    }

    const allGenres = genresResponse.data.genres;
    const seriesData = [];

    // Fetch series for each genre
    for (const genre of allGenres) {
      const seriesByGenreResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=${genre.id}`);

      const seriesForGenre = seriesByGenreResponse.data.results.map(serie => ({
        id: serie.id,
        title: serie.name,
        poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
        type: 'series',
        genre: genre.name,
      }));

      seriesData.push(...seriesForGenre);
    }

    // Fetch trending series
    const trendingSeriesResponse = await axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en`);
    const trendingSeries = trendingSeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
    }));

    // Fetch top-rated series
    const topRatedSeriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const topRatedSeries = topRatedSeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
    }));

    // Fetch series for additional categories
    const comedySeriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=35`);
    const comedySeries = comedySeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
      genre: 'Comedy',
    }));

    const scifiSeriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=10765`);
    const scifiSeries = scifiSeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
      genre: 'Science Fiction',
    }));

    const fantasySeriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=10759`);
    const fantasySeries = fantasySeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
      genre: 'Fantasy',
    }));

    const mysterySeriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=9648`);
    const mysterySeries = mysterySeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
      genre: 'Mystery',
    }));

    const thrillerSeriesResponse = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=53`);
    const thrillerSeries = thrillerSeriesResponse.data.results.slice(0, 10).map(serie => ({
      id: serie.id,
      title: serie.name,
      poster: serie.poster_path ? `https://image.tmdb.org/t/p/w300${serie.poster_path}` : null,
      type: 'series',
      genre: 'Thriller',
    }));

    // ... Add similar code for other series categories ...

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: {
        hero: {
          id: 848326,
          type: 'series',
          title: 'Rebel Moon - Part One: A Child of Fire',
          description: 'When a peaceful colony on the edge of the galaxy finds itself threatened by the armies of the tyrannical Regent Balisarius, they dispatch Kora, a young woman with a mysterious past, to seek out warriors from neighboring planets to help them take a stand.',
          images: {
            logo: 'https://image.tmdb.org/t/p/w500/ydHHWD7DIYnSVT8G5p9BDC0aJHC.png',
            backdrop: 'https://image.tmdb.org/t/p/original/sRLC052ieEzkQs9dEtPMfFxYkej.jpg',
          },
        },
        collections: [
          {
            title: 'Trending Series this week 🎉',
            items: trendingSeries,
          },
          {
            title: 'Top Rated TV Shows 🔥',
            items: topRatedSeries,
          },
          {
            title: 'Comedy Series 😂',
            items: comedySeries,
          },
          {
            title: 'Science Fiction Series 🚀',
            items: scifiSeries,
          },
          {
            title: 'Fantasy Series 🧙',
            items: fantasySeries,
          },
          {
            title: 'Mystery Series 🕵️',
            items: mysterySeries,
          },
          // ... Similar collection entries for other series categories ...
        ],
      },
    };

    res.json(apiResponse);
  } catch (error) {
    console.error('Error fetching TV series:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ... (remaining code)

// Game data
const games = [
  {
    id: 1,
    image: 'https://subway-surfers.lukasallis-robe.repl.co/th.jpg',
    game_url: 'https://subway-surfers.lukasallis-robe.repl.co/'
  },

];

// API endpoint for /v3/games
app.get('/v3/games', (req, res) => {
  try {
    // Assuming you want to send the entire game list
    const apiResponse = {
      success: true,
      data: games,
    };
    res.json(apiResponse);
  } catch (error) {
    console.error('Error fetching game data:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// API endpoint for /v3/games/:id
app.get('/v3/game/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Find the game with the specified id
    const game = games.find((g) => g.id.toString() === id);

    if (!game) {
      // If the game with the provided id is not found
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    // Construct the HTML page with the embedded game
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Game Embed</title>
        <style>
            body, html {
                margin: 0;
                padding: 0;
                overflow: hidden; /* Prevent default margin and padding, and hide overflow */
            }

            .iframe-container {
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 aspect ratio, adjust as needed */
            }

            iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        </style>

      </head>
      <body>
    <iframe src="${game.game_url}" frameborder="0" allowfullscreen></iframe>
</div>
      </body>
      </html>
    `;

    // Set the response content type to HTML
    res.setHeader('Content-Type', 'text/html');
    // Send the HTML page with the embedded game
    res.send(htmlContent);
  } catch (error) {
    console.error('Error embedding game by ID:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// ... (previous code)

app.get('/v3/movie', async (req, res) => {
  try {
    // Fetch genres
    const genresResponse = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en`);

    if (!genresResponse.data.genres) {
      throw new Error('Error fetching genres');
    }

    const allGenres = genresResponse.data.genres;
    const moviesData = [];

    // Fetch movies for each genre
    for (const genre of allGenres) {
      const moviesByGenreResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=${genre.id}`);

      const moviesForGenre = moviesByGenreResponse.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
        type: 'movie',
        genre: genre.name,
      }));

      moviesData.push(...moviesForGenre);
    }

    // Fetch trending movies
    const trendingMoviesResponse = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en`);
    const trendingMovies = trendingMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Fetch popular movies
    const popularMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const popularMovies = popularMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Fetch top-rated movies
    const topRatedMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const topRatedMovies = topRatedMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Fetch horror movies
    const horrorMoviesResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=27`);
    const horrorMovies = horrorMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Fetch upcoming movies
    const upcomingMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const upcomingMovies = upcomingMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Fetch cartoon movies
    const cartoonMoviesResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en&sort_by=popularity.desc&with_genres=16`);
    const cartoonMovies = cartoonMoviesResponse.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: {
        hero: {
          id: 695721,
          type: 'movie',
          title: 'The Hunger Games: The Ballad of Songbirds & Snakes',
          description: '64 years before he becomes the tyrannical president of Panem, Coriolanus Snow sees a chance for a change in fortunes when he mentors Lucy Gray Baird, the female tribute from District 12.',
          images: {
            logo: 'https://image.tmdb.org/t/p/w500/iPYwiuABxvJw0OMkEargeg34fgI.png',
            backdrop: 'https://image.tmdb.org/t/p/original/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg',
          },
        },
        collections: [
          {
            title: 'Trending Movies this week 🔥',
            items: trendingMovies,
          },
          {
            title: 'Popular Movies ⭐',
            items: popularMovies,
          },
          {
            title: 'Top Rated Movies 🎥',
            items: topRatedMovies,
          },
          {
            title: 'Horror Movies 🐦‍⬛',
            items: horrorMovies,
          },
          {
            title: 'Upcoming movies 🎁',
            items: upcomingMovies,
          },
          {
            title: 'Cartoon Movies ☀️',
            items: cartoonMovies,
          },
          // ... Similar collection entries for other categories ...
        ],
      },
    };

    res.json(apiResponse);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ... (remaining code)



app.get('/movie/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movieResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
    const movieVideosResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
    const movieImagesResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_API_KEY}&language=en`);

    // Fetch recommendations separately
    const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const recommendedMovies = recommendationsResponse.data.results || [];

    // Select the second backdrop if it exists
    const selectedBackdrop = movieImagesResponse.data.backdrops.length > 1 ? movieImagesResponse.data.backdrops[1] : null;

    const movieData = {
      success: true,
      data: {
        id: movieResponse.data.id,
        title: movieResponse.data.title || '',
        description: movieResponse.data.overview || '',
        tagline: movieResponse.data.tagline || null, // Set to null if tagline is not available
        genres: (movieResponse.data.genres || []).map(genre => genre.name) || [],
        date: movieResponse.data.release_date || '',
        runtime: movieResponse.data.runtime || 0,
        suggested: recommendedMovies
          .filter(movie => movie.poster_path !== null) // Exclude suggested movies without an image
          .map(movie => ({
            id: movie.id,
            title: movie.title || '',
            image: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
            type: 'movie',
          })),
        trailer: movieVideosResponse.data.results.length > 0 ? `https://www.youtube.com/watch?v=${movieVideosResponse.data.results[0].key}` : '',
        images: {
          backdrop: selectedBackdrop ? `https://image.tmdb.org/t/p/original${selectedBackdrop.file_path}` : '',
          poster: movieResponse.data.poster_path ? `https://image.tmdb.org/t/p/w500${movieResponse.data.poster_path}` : '',
          logo: movieImagesResponse.data.logos.length > 0 ? `https://image.tmdb.org/t/p/w500${movieImagesResponse.data.logos[0].file_path}` : '',
        },
      },
    };

    res.json(movieData);
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});




// Function to get IMDb ID from TMDb ID
async function getImdbIdFromTmdbId(tmdbId) {
  try {
    const tmdbUrl = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${process.env.API_KEY}`;
    const response = await axios.get(tmdbUrl);
    const imdbId = response.data.imdb_id;
    return imdbId;
  } catch (error) {
    console.error('Error fetching IMDb ID:', error.message);
    throw new Error('Failed to get IMDb ID');
  }
}

app.get('/v2/embed/series', (req, res) => {
  const { id, s: season, e: episode } = req.query;

  if (!id || !season) {
    return res.status(400).json({ success: false, error: 'id and season parameters are required for TV shows' });
  }

  // Remove ?v=undefined from the id
  const cleanedId = id.replace(/\?v=undefined/i, '');

  // For other cases, construct the URL with season and episode
  const embedUrl = `https://swiflytvapiembed.onrender.com//tv/${cleanedId}/${season}${episode ? `/${episode}` : ''}`;
  res.redirect(embedUrl);
});



app.get('/v2/embed/movie', async (req, res) => {
  let { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: 'id parameter is required for movies' });
  }

  // Remove ?v=undefined from the id
  id = id.replace(/\?v=undefined/i, '');

  try {
    // Construct the URL with TMDB ID
    const embedUrl = `https://swiflytvapiembed.onrender.com/movie/${id}`;
    res.redirect(embedUrl);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/v3/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }

    // Use TMDb API to search for movies and TV shows
    const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en&page=1`;
    const searchTVShowsUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en&page=1`;

    const [moviesResponse, tvShowsResponse] = await Promise.all([
      axios.get(searchMoviesUrl),
      axios.get(searchTVShowsUrl)
    ]);

    const moviesData = moviesResponse.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
      type: 'movie',
    }));

    const tvShowsData = tvShowsResponse.data.results.map(show => ({
      id: show.id,
      title: show.name,
      image: show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : null,
      type: 'tv',
    }));

    const searchData = [...moviesData, ...tvShowsData];

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: searchData,
    };

    res.json(apiResponse);
  } catch (error) {
    console.error('Error searching:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/v3/home', async (req, res) => {
  try {
    const trendingMoviesResponse = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const topRatedMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const upcomingMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en&page=1`);

    const trendingSeriesResponse = await axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const popularMoviesResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const popularSeriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const topRatedSeriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en&page=1`);

    const homeData = {
      success: true,
      data: {
        hero: {
          id: 572802,
          type: 'movie',
          title: 'Thanksgiving',
          description: 'After a Black Friday riot ends in tragedy, a mysterious Thanksgiving-inspired killer terrorizes Plymouth, Massachusetts - the birthplace of the holiday. Picking off residents one by one, what begins as random revenge killings are soon revealed to be part of a larger, sinister holiday plan.',
          images: {
            logo: 'https://image.tmdb.org/t/p/w500/6L4JRz19g4wp1znDxn7WxvPo4U3.png',
            backdrop: 'https://image.tmdb.org/t/p/original/ktHEdqmMWC1wdfPRMRCTZe2OISL.jpg',
          },
        },
        collections: [
          {
            title: 'Trending Movies this week 🔥',
            items: trendingMoviesResponse.data.results.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
              type: 'movie',
            })),
          },
          {
            title: 'Trending Series this week 📈',
            items: trendingSeriesResponse.data.results.map(series => ({
              id: series.id,
              title: series.name,
              poster: `https://image.tmdb.org/t/p/w300${series.poster_path}`,
              type: 'series',
            })),
          },
          {
            title: 'Popular Movies ⭐',
            items: popularMoviesResponse.data.results.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
              type: 'movie',
            })),
          },
          {
            title: 'Popular Series 🎉',
            items: popularSeriesResponse.data.results.map(series => ({
              id: series.id,
              title: series.name,
              poster: `https://image.tmdb.org/t/p/w300${series.poster_path}`,
              type: 'series',
            })),
          },
          {
            title: 'Top Rated Movies 🎥',
            items: topRatedMoviesResponse.data.results.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
              type: 'movie',
            })),
          },
          {
            title: 'Top Rated Series 📚',
            items: topRatedSeriesResponse.data.results.map(series => ({
              id: series.id,
              title: series.name,
              poster: `https://image.tmdb.org/t/p/w300${series.poster_path}`,
              type: 'series',
            })),
          },
        ],
      },
    };

    res.json(homeData);
  } catch (error) {
    console.error('Error fetching home data:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/series/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tvShowResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en`);
    const tvShowVideosResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${TMDB_API_KEY}&language=en`);
    const tvShowImagesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/images?api_key=${TMDB_API_KEY}&language=en&page=1`);

    // Fetch recommendations separately
    const recommendationsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en&page=1`);
    const recommendedShows = recommendationsResponse.data.results || [];

    const tvShowData = {
      success: true,
      data: {
        id: tvShowResponse.data.id,
        title: tvShowResponse.data.name || '',
        description: tvShowResponse.data.overview || '',
        tagline: tvShowResponse.data.tagline || null, // Set to null if tagline is not available
        genres: (tvShowResponse.data.genres || []).map(genre => genre.name) || [],
        date: tvShowResponse.data.first_air_date || '',
        seasons: tvShowResponse.data.number_of_seasons || 0,
        episodes: [],
        suggested: recommendedShows
          .filter(show => show.poster_path !== null) // Exclude suggested shows without an image
          .map(show => ({
            id: show.id,
            title: show.name || '',
            image: `https://image.tmdb.org/t/p/w300${show.poster_path}`,
            type: 'tv',
          })),
        trailer: tvShowVideosResponse.data.results.length > 0 ? `https://www.youtube.com/watch?v=${tvShowVideosResponse.data.results[0].key}` : '',
        images: {
          backdrop: tvShowImagesResponse.data.backdrops.length > 0 ? `https://image.tmdb.org/t/p/original${tvShowImagesResponse.data.backdrops[0].file_path}` : '',
          poster: tvShowResponse.data.poster_path ? `https://image.tmdb.org/t/p/w500${tvShowResponse.data.poster_path}` : '',
          logo: tvShowImagesResponse.data.logos.length > 0 ? `https://image.tmdb.org/t/p/w500${tvShowImagesResponse.data.logos[0].file_path}` : '',
        },
      },
    };

    // Fetch episodes for each season and add them to the flat structure
    for (let seasonNumber = 1; seasonNumber <= tvShowData.data.seasons; seasonNumber++) {
      const seasonResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en`);
      const seasonEpisodes = (seasonResponse.data.episodes || []).map(episode => ({
        number: episode.episode_number || 0,
        image: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : null,
        title: episode.name || '',
        runtime: episode.runtime || 0,
      }));

      // Exclude episodes with null image
      const filteredEpisodes = seasonEpisodes.filter(episode => episode.image !== null);

      tvShowData.data.episodes.push(...filteredEpisodes);
    }

    res.json(tvShowData);
  } catch (error) {
    console.error('Error fetching TV show details:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/v3/tv/:id/episodes', async (req, res) => {
  try {
    const tvId = req.params.id;
    const nSeason = req.query.s || 1; // default to season 1 if not provided
    const tmdbApiUrl = `https://api.themoviedb.org/3/tv/${tvId}/season/${nSeason}?api_key=${TMDB_API_KEY}&language=en`;

    // Fetch TV show episodes from TMDb API
    const response = await axios.get(tmdbApiUrl);
    const episodesData = response.data.episodes;

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: episodesData.map(episode => ({
        number: episode.episode_number,
        image: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : null,
        title: episode.name,
        runtime: episode.runtime
      }))
    };

    res.json(apiResponse);
  } catch (error) {
    console.error('Error fetching TV show episodes:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
app.get('/episodes/:id', async (req, res) => {
  try {
    const seriesId = req.params.id;
    const seasonNumber = req.query.s || 1; // Default to season 1 if not specified

    // Fetch episodes for the specified series and season
    const episodesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en`);

    if (!episodesResponse.data.episodes) {
      throw new Error('Error fetching episodes');
    }

    const episodesData = episodesResponse.data.episodes.map(episode => ({
      number: episode.episode_number,
      title: episode.name,
      description: episode.overview,
      image: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : null,
      runtime: episode.runtime,
    }));

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: episodesData,
    };

    res.json(apiResponse);
  } catch (error) {
    console.error(`Error fetching episodes for series ${req.params.id} and season ${req.query.s}:`, error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;

    // Fetch search results from The Movie Database (TMDb) API
    const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en&query=${query}`);

    if (!searchResponse.data.results) {
      throw new Error('Error fetching search results');
    }

    const searchData = searchResponse.data.results
      .filter(result => result.id && (result.title || result.name) && (result.poster_path || result.backdrop_path))
      .map(result => ({
        id: result.id,
        title: result.title || result.name,
        poster: result.poster_path ? `https://image.tmdb.org/t/p/w300${result.poster_path}` : null,
        type: result.media_type === 'movie' ? 'movie' : 'series',
      }));

    // Prepare the response in the desired format
    const apiResponse = {
      success: true,
      data: searchData,
    };

    res.json(apiResponse);
  } catch (error) {
    console.error(`Error fetching search results for query ${req.query.query}:`, error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
