import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({movie, date}) => {
    var {description, image_url, name, genre_name} = movie;
    return (
        <Link to={`/movies/${movie.movie_id}`} state={{movie, date}} className='card'>
            <div className="image">
                <img src={image_url} alt={name} style={{minHeight: '400px'}}/>
            </div>
            <div className='content'>
                <div className='header'>{name} </div>
                <div className="description">{description}</div>
            </div>
            <div className='extra' style={{backgroundColor: 'teal'}}>
                <div className='meta right floated' style={{color: 'white', fontStyle: 'italic'}}>{genre_name}</div>
            </div>
            <div className='extra content' style={{backgroundColor: 'rgba(255,99,71,1)', color: 'white'}}>
                <span className='right floated'>{date}</span>
                <i className="calendar alternate outline icon"/>
                Release Date:
            </div>
        </Link>
    )
};

export default MovieCard;