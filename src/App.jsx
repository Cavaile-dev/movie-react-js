import React, {useEffect, useState} from 'react';
import Search from './components/search.jsx';
import Spinner from './components/spinner.jsx';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovies = async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                throw new Error('Something went wrong');
            }

            const data = await response.json();
            // console.log(data);

            if(data.Response === 'False') {
                setErrorMessage(data.Error ||'Failed to fetch movies.');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

        } catch (error) {
            console.log(`Error Fetching Movies: ${error}`);
            setErrorMessage('Error Fetching Movies. Please try again later.');

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies()
    }, []);

    return (
      <main>
          <div className="pattern" />

          <div className="wrapper">
              <header>
                  <img src="/hero-img.png" alt="Hero Banner" />
                  <h1>Find Your Type of <span className="text-gradient">Movies</span></h1>
                  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              </header>

              <section className="all-movies">
                  <h2 className='mt-[40px]'>All Movies</h2>

                  {isLoading ? (
                      <Spinner />
                  ) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>
                  ) : (
                      <ul>
                          {movieList.map((movie) => (
                              <MovieCard key={movie.id} movie={movie} />
                          ))}
                      </ul>

                  )}
              </section>
          </div>
      </main>
  )
};

export default App;