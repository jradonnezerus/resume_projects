import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api_call from '../api/api_call';

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
            localStorage.setItem('name', name);
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            navigate('/');
        } catch { // login failed
            setLoginFailure(true);
        }
    };

    return (
        <div className='ui container' style={{textAlign: 'center'}}>
            <form className="ui form" onSubmit={formSubmit}>
                <div className='field' style={{width: '25%', margin: '30px auto 30px'}}>
                    <label>Email</label>
                    <input type="text" name="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="field" style={{width: '25%', margin: '30px auto 30px'}}>
                    <label>Password</label>
                    <input type="text" name="password" placeholder="password" value={pw} onChange={e => setPw(e.target.value)}/>
                </div>
                <button className="ui button red" type="submit">Submit</button>
            </form>
            <p style={{marginTop: '30px'}}>
                {loginFailure? <p>Invalid email / password. Please try again.</p> : ''}
            </p>
        </div>
    )
}

export default Login;