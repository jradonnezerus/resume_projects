import React, {useState, useEffect} from 'react';
import api_call from '../api/api_call';
import MovieCard from './MovieCard';

import websitePicture from '../img/websiteheader.png';

const MovieList = (props) => {

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState({});
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState(localStorage.getItem('genreFilter') || '');

    useEffect(() => {
        const getMovies = async () => {
            const mvs = await api_call.get('/movies');
            setMovies(mvs.data);
            console.log(mvs.data);
        }
        getMovies();

        const getGenres = async () => {
            const genresList = await api_call.get('/genres');
            var genreDict = {};
            genresList.data.map(genre => {
                var {genre_id, name} = genre;
                genreDict = {...genreDict, [`${genre_id}`]: name}
                return null;
            });
            setGenres({...genres, ...genreDict});
        };
        getGenres();

    }, [])

    const movieList = movies.map(movie => {
        var date = new Date(movie.release_date);
        date = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        return (
            <MovieCard key={movie.movie_id} movie={movie} date={date}/>
        )
    });

    const genresSelection = Object.entries(genres).map(([key, value]) => {
        return (
            <option key={key} value={key}>{value}</option>
        )
    });

    useEffect(() => {
        const research = async () => {
            try {
                if (genreFilter !== 'none' && search !== '') { // if both search and genre filters are used
                    const moviesOfGenre = await api_call.get(`/movies?genre=${genreFilter}&search=${search}`);
                    setMovies(moviesOfGenre.data);
                } else if (search !== '') { // only filter for search
                    const moviesOfGenre = await api_call.get(`/movies?search=${search}`);
                    setMovies(moviesOfGenre.data);
                } else if (genreFilter !== 'none') { // only filter for genre
                    const moviesOfGenre = await api_call.get(`/movies?genre=${genreFilter}`);
                    setMovies(moviesOfGenre.data);
                } else {
                    const movies = await api_call.get(`/movies`);
                    setMovies(movies.data);
                }
            } catch { // no movies of that genre and substring
                setMovies([]);
            }
        }
        research();
    }, [search, genreFilter])

    const setNewGenreFilter = (e) => {
        setGenreFilter(e.target.value);
        localStorage.setItem('genreFilter', e.target.value);
    };

    return (
        <div>
            <div className='ui container' style={{textAlign: 'center', margin: '-10px auto -50px'}}>
                <img src={websitePicture} alt='website front page' style={{width: '80%'}}/>
            </div>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <p style={{fontSize: '1.5rem', fontStyle: 'italic'}}>Click on any movie card to see its reviews!</p>
            </div>
            <div className='ui form'>
                <div className='two fields'>
                    <div className='field'>
                        <label>Search Movie:</label>
                        <input type='text' placeholder='Search' onChange={e => setSearch(e.target.value)}/>
                    </div>
                    <div className='field'>
                        <label>Filter by Genre:</label>
                        <select className='ui fluid dropdown' value={genreFilter} onChange={setNewGenreFilter} >
                            <option value="none">None</option>
                            {genresSelection}
                        </select>
                    </div>
                </div>
            </div>
            <div className="ui four cards" style={{marginTop: '20px'}}>
                {movieList.length === 0?  'No movies of this genre exists yet.': movieList}
            </div>
        </div>
    )
};

export default MovieList;
