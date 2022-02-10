import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api_call from '../api/api_call';

const SingleMovie = () => {

    let location = useLocation();
    var date = location.state.date;
    var {description, image_url, name, genre_name, movie_id} = location.state.movie;
    var token = localStorage.getItem('token');
    var reviewer_id = localStorage.getItem('user_id');

    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState('');

    useEffect(() => {
        const getReviews = async () => {
            try {
                const rvs = await api_call.get(`/reviews/${movie_id}`);
                setReviews(rvs.data);
            } catch {
                console.log("No reviews exist.");
            }
        }
        getReviews();
    }, []);

    const movieDetails = (
        <div className='ui container' style={{textAlign: 'center'}}>
            <img src={image_url} alt={name} style={{maxWidth: '30%'}}/>
            <h1 style={{margin: '10px'}}>{name}</h1>
            <p>{description}</p>
            <div style={{backgroundColor: 'teal', width:'50%', marginLeft: 'auto', marginRight: 'auto'}}>
                <div style={{color: 'white', fontStyle: 'italic'}}>{genre_name}</div>
            </div>
            <div style={{backgroundColor: 'rgba(255,99,71,1)', color: 'white', width:'50%', marginLeft: 'auto', marginRight: 'auto'}}>
                <i className="calendar alternate outline icon"/>
                Release Date: <span className='right floated'>{date}</span>
            </div>
        </div>
    );

    const reviewsList = reviews.map(review => {
        console.log(review);
        return (
            <div key={review.review_id} className="comment" style={{fontSize: '130%', border: '2px solid', padding: '15px'}}>
                <div className="content">
                    <p className="author" style={{marginBottom: '10px'}}>Name: {review.name}</p>
                    <div className="text">Review: {review.review}</div>
                    <div className="actions">
                        <p className="reply">Reply</p>
                    </div>
                </div>
            </div>
        )
    });

    const postReview = async (e) => {
        e.preventDefault();
        console.log(userReview);
        if (userReview !== '') {
            await api_call.post(`/reviews/${movie_id}`, {
                user_id: reviewer_id,
                review: userReview
            }, {
                'headers': {'Authorization': 'Bearer ' + token}
            });
            const rvs = await api_call.get(`/reviews/${movie_id}`);
            setReviews(rvs.data);
            setUserReview('');
        }
        // else.. catch the error if review fails to post
        console.log(userReview);
    };
    
    const userComment = (
        <form className ="ui form" onSubmit={postReview}>
            <div className ="field">
                <label>Input Your Review</label>
                <textarea value={userReview} onChange={e => setUserReview(e.target.value)}></textarea>
            </div>
            <div className='field' style={{textAlign: 'center'}}>
                <button className="ui button red" type="submit">Submit</button>
            </div>
        </form>
    );

    const reviewsSection = (
        <div className='ui container' style={{marginTop: '15px'}}>
            <h1>Movie Reviews:</h1>
            {token? userComment: ''}
            <div className='ui comments'>
                {reviewsList.length > 0? reviewsList: 'No reviews exist for this movie yet.'}
            </div>
            <p style={{height: '1px'}}></p>
        </div>
    );

    return (
        <div className='ui container'>
            {movieDetails}
            <hr style={{border: '2px solid', marginTop: '15px'}}/>
            {reviewsSection}
        </div>
    );
};

export default SingleMovie;