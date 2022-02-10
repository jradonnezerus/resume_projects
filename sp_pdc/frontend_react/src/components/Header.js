import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = (props) => {

    let location = useLocation();
    let navigate = useNavigate();

    var username = localStorage.getItem('name');

    const logout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/');
    }

    const notLoggedIn = (
        <React.Fragment>
            <Link to='/login' className="ui inverted button">Login</Link>
            <Link to='/' className="ui inverted button" style={{marginLeft: '5px'}}>Sign Up</Link>
        </React.Fragment>
    );

    const loggedIn = (
        <React.Fragment>
            <p className='ui orange button'>Welcome {username}!</p>
            <Link to='/' className="ui red button" style={{marginLeft: '5px'}} onClick={logout}>Logout</Link>
        </React.Fragment>
    );


    return (
        <div className="ui large inverted pointing menu blue" style={{marginTop: '10px'}}>
            <Link to='/' className="toc item">
                <i className="sidebar icon"></i>
            </Link>
            <Link to='/' className={location.pathname === '/'? 'active item' : 'item'} style={{color: 'white'}}>Home</Link>
            <Link to='/about' className={location.pathname === '/about'? 'active item' : 'item'} style={{color: 'white'}}>About Us</Link>
            <div className="right item">
                {username? loggedIn : notLoggedIn}
            </div>
        </div>
    )
};

export default Header;
