import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Header from './Header';
import MoviesList from './MoviesList';
import About from './About';
import Error404 from './Error404';
import SingleMovie from './SingleMovie';
import Login from './Login';

const App = () => {

    return (
        <div className='ui container'>
            <Router>
                <Header/>
                <Routes>
                    <Route path='/' element={<MoviesList/>}/>
                    <Route path='/movies/:movieID' element={<SingleMovie/>}/>
                    <Route path='/about' element={<About/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='*' element={<Error404/>}/>
                </Routes>
            </Router>
        </div>
    );
};

// 1. Login component
// 2. Review component
// 3. Genre filter

export default App;