import { Image, View, Text } from 'react-native';
import { Link } from 'react-router-native';

const MovieCard = ({movie, width}) => {
    var {description, image_url, name, genre_name, release_date} = movie;
    var date = new Date(release_date);
    var year = date.getFullYear();
    date = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    return (
        <Link to={`/movies/${movie.movie_id}`} state={{movie, date, width}} style={{minHeight: 250, width: width-5, padding: 5, borderWidth: 1}}>
            <View style={{}}>
                <Image source={{uri: image_url}} style={{height: 200, width: width-15}}/>
                <Text style={{fontWeight: 'bold', fontSize: 13, textAlign: 'center'}}>{name}</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13, textAlign: 'center'}}>({year})</Text>
            </View>
        </Link>
    )
};

export default MovieCard;