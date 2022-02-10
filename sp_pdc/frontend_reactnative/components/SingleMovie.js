import { useEffect, useState } from 'react';
import { View, Image, Text, FlatList, ScrollView, Button, TextInput } from 'react-native';
import { useLocation } from 'react-router-native';
import api_call from '../api/api_call';

import { storeData, storeObject, getData, getObject, clearStorage } from '../common/Common';

const SingleMovie = () => {

    let location = useLocation();
    var date = location.state.date;
    var {description, image_url, name, genre_name, movie_id} = location.state.movie;
    var width = width;

    const [token, setToken] = useState(null);
    const [reviewerId, setRevierId] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState('');

    useEffect(() => {
        getData('token').then(tkn => setToken(tkn));
        getData('user_id').then(userId => setRevierId(userId));
    })

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

    const Hr = () => {
        return (<View style={{borderBottomColor: 'black', borderBottomWidth: 3, marginTop: 10, marginBottom: 5}} />);
    };

    const movieDetails = (
        <View style={{flex: 1, alignItems: 'center'}}>
            <Image source={{uri: image_url}} style={{height: 300, width: 300, resizeMode: 'contain', marginTop: 10}}/>
            <View>
                <Text style={{marginTop: 10, marginBottom: 5, fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>{name}</Text>
                <Text style={{fontStyle: 'italic', textAlign: 'center'}}>{description}</Text>
                <View style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
                    <View style={{backgroundColor: 'teal', padding: 5, paddingHorizontal: 20}}>
                        <Text style={{color: 'white', fontStyle: 'italic'}}>{genre_name}</Text>
                    </View>
                    <View style={{backgroundColor: 'orange', padding: 5, paddingHorizontal: 20}}>
                        <Text style={{color: 'white', fontStyle: 'italic'}}>{date}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    // flatlist cannot work well here since its scrollview
    const reviewsList = reviews.map(review => {
        console.log(review);
        return (
            <View key={review.review_id} style={{marginBottom: 5, borderWidth: 1, padding: 5}}>
                <View >
                    <Text><Text style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>Name:</Text> {review.name}</Text>
                    <Text><Text style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>Review: </Text> {review.review}</Text>
                </View>
            </View>
        )
    });

    const postReview = async (e) => {
        e.preventDefault();
        console.log(userReview);
        if (userReview !== '') {
            await api_call.post(`/reviews/${movie_id}`, {
                user_id: reviewerId,
                review: userReview
            }, {
                'headers': {'Authorization': 'Bearer ' + token}
            });
            const rvs = await api_call.get(`/reviews/${movie_id}`);
            setReviews(rvs.data);
            setUserReview('');
        } else {
            // else.. catch the error if review fails to post
            console.log('posting of review has failed.')
        }
        console.log(userReview);
    };
    
    const userComment = (
        <View>
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline', backgroundColor: 'brown', color: 'white', paddingHorizontal: 10, paddingVertical: 2, marginTop: 3}}>Input Your Review</Text>
                <TextInput value={userReview} multiline={true} numberOfLines={5} onChangeText={setUserReview} style={{borderWidth: 1, marginVertical: 10}}></TextInput>
            </View>
            <View style={{paddingHorizontal: 50, marginBottom: 10}}>
                <Button title='Submit' onPress={postReview}/>
            </View>
        </View>
    );

    const reviewsSection = (
        <View style={{margin: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Movie Reviews:</Text>
            {token? userComment: null}
            <View style={{margin: 5}}>
                {reviews.length > 0? 
                    <View>{reviewsList}</View>: 
                    <Text>No reviews exist for this movie yet.</Text>
                }
            </View>
        </View>
    );

    return (
        <ScrollView style={{flex: 1}}>
            {movieDetails}
            <Hr/>
            {reviewsSection}
        </ScrollView>
    );
};

export default SingleMovie;