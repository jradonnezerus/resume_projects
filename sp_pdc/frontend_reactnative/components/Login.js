import { useState } from 'react';
import { TextInput, View, Text, Button } from 'react-native';
import { useNavigate } from 'react-router-native';
import api_call from '../api/api_call';

import { storeData, storeObject, getData, getObject, clearStorage } from '../common/Common';

const Login = () => {
    
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [loginFailure, setLoginFailure] = useState(false);

    let navigate = useNavigate();

    const formSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginDetails = await api_call.post('/login', {
                email: email,
                password: pw
            });
            setLoginFailure(false);
            var {name, token, user_id} = loginDetails.data;
            storeData('name', name);
            storeData('token', token);
            storeData('user_id', user_id.toString());
            navigate('/');
        } catch { // login failed
            setLoginFailure(true);
        }
    };

    return (
        <View style={{textAlign: 'center', padding: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
                <Text style={{flex: 1}}>Email</Text>
                <TextInput style={{flex: 3, borderWidth: 2}} keyboardType='email-address' placeholder="email" value={email} onChangeText={setEmail}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginBottom: 30}}>
                <Text style={{flex: 1}}>Password</Text>
                <TextInput style={{flex: 3, borderWidth: 2}} placeholder="password" value={pw} onChangeText={setPw}/>
            </View>
            <Button title='Submit' color='red' onPress={formSubmit}/>
            <Text style={{marginTop: 30}}>
                {loginFailure? <Text style={{color: 'red', fontWeight: 'bold'}}>Invalid email / password. Please try again.</Text> : ''}
            </Text>
        </View>
    )
}

export default Login;