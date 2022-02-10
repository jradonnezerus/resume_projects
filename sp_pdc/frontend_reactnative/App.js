import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NativeRouter, Link, Routes, Route } from 'react-router-native';

import Header from './components/Header';
import Error404 from './components/Error404';
import About from './components/About';
import MovieList from './components/MoviesList';
import SingleMovie from './components/SingleMovie';
import Login from './components/Login';

export default function App() {
  return (
    <NativeRouter>
      <View style={{flex: 1, marginTop: StatusBar.currentHeight, backgroundColor: 'beige'}}>
        <Header/>
        <Routes>
          <Route path='/' element={<MovieList/>}/>
          <Route path='/movies/:movieID' element={<SingleMovie/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='*' element={<Error404/>}/>
        </Routes>
      </View>
    </NativeRouter>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
