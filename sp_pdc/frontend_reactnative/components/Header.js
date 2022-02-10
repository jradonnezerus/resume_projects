import React, {useEffect, useState} from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import { Link, useLocation, useNavigate } from 'react-router-native';

import { storeData, storeObject, getData, getObject, clearStorage, clearStorageByKey } from '../common/Common';

const Header = (props) => {

    let location = useLocation();
    let navigate = useNavigate();

    const [username, setUsername] = useState(null);

    const logout = () => {
        clearStorageByKey('name');
        clearStorageByKey('token');
        clearStorageByKey('user_id');
        setUsername('');
        navigate('/');
    };

    useEffect(() => {
        getData('name').then(name => {
            setUsername(name)
        });
    });

    const notLoggedIn = (
        <React.Fragment>
            <Button title='Login' color='red' onPress={() => navigate('/login')}/>
            <Button title='Sign Up' color='green' onPress={() => navigate('/')}/>
        </React.Fragment>
    );

    const loggedIn = (
        <React.Fragment>
            <Button title={`Welcome ${username}`} color='red'/>
            <Button title='Logout' color='green' onPress={logout}/>
        </React.Fragment>
    );

    return (
        <View style={{flexDirection: 'row', backgroundColor: 'orange', paddingVertical: 10, paddingHorizontal: 5}}>
            <Button title='Home' color='blue' onPress={() => navigate('/')}/>
            <Button title='About Us' color='brown' onPress={() => navigate('/about')}/>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                {username? loggedIn : notLoggedIn}
            </View>
        </View>
    )
};

export default Header;
