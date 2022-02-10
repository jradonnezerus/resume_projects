import {useState, useEffect} from 'react';
import { View, Text, Image , useWindowDimensions, FlatList, TextInput, Picker, Keyboard, TouchableWithoutFeedback} from 'react-native';
import api_call from '../api/api_call';
import MovieCard from './MovieCard';

import websitePicture from '../assets/websiteheader.png';

import { storeData, storeObject, getData, getObject, clearStorage } from '../common/Common';

const MovieList = (props) => {

    const {height, width} = useWindowDimensions();
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState({});
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState(getData('genreFilter').then(genre => setGenreFilter(genre)) || '');

    useEffect(() => {
        const getMovies = async () => {
            const mvs = await api_call.get('/movies');
            setMovies(mvs.data);
            // console.log(mvs.data);
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

    const MovieFlatList = () => {
        return(
            <FlatList
                data={movies}
                renderItem={({item}) => <MovieCard movie={item} width={width/3}/> }
                keyExtractor={item => item.movie_id}
                numColumns={3}
            />
        )
    };

    const genresSelection = Object.entries(genres).map(([key, value]) => {
        return (
            <Picker.Item key={key} label={value} value={key}/>
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

    const setNewGenreFilter = (value) => {
        setGenreFilter(value);
        storeData('genreFilter', value);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1, backgroundColor: 'beige', alignItems: 'center'}}>
            <View style={{flex: 1}}>
                <Image style={{height: 150, width: width}} source={websitePicture}/>
                <Text style={{fontSize: 16, fontWeight: 'bold', paddingTop: 10}}>Click on any movie card to see its reviews!</Text>
                <View style={{flexDirection: 'row', marginHorizontal: 10, alignItems: 'center', borderWidth: 1, marginTop: 5}}>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <Text style={{fontWeight: 'bold'}}>Search Movie:</Text>
                        <TextInput style={{borderBottomWidth: 1}} placeholder='Search' onChangeText={setSearch}/>
                    </View>
                    <View style={{width: 20}}/>
                    <View style={{flex: 1}}>
                        <Text style={{fontWeight: 'bold'}}>Filter by Genre:</Text>
                        <Picker selectedValue={genreFilter} onValueChange={(itemValue, itemIndex) => setNewGenreFilter(itemValue)} >
                            <Picker.Item label='None' value="none"/>
                            {genresSelection}
                        </Picker>
                    </View>
                </View>
                <View style={{flex: 1, paddingTop: 10}}>
                    {movies.length === 0?  
                        <Text>No movies of this genre exists yet.</Text> : 
                        <MovieFlatList/>
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default MovieList;
