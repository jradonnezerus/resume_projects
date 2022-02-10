import { View, StatusBar, Text } from 'react-native';
import Layout from './components/Layout';
import IGLayout from './components/IGLayout';
import AssetApp from './components/AssetApp';
import AssetExample from './components/AssetExample';
import { NativeRouter, Link, Routes, Route } from 'react-router-native';


export default App = () => {

  return (
    <NativeRouter>
      <View style={{flex: 1, marginTop: StatusBar.currentHeight, backgroundColor: 'beige'}}>
      <Link to='/'><Text>Home page</Text></Link>
      <Link to='/about'><Text>About</Text></Link>
        <Routes>
          <Route path='/' element={<Layout/>}/>
          <Route path='/about' element={<IGLayout/>}/>
        </Routes>
        {/* <Layout/> */}
        {/* <IGLayout/> */}
        {/* <AssetApp/> */}
        {/* <AssetExample/> */}
      </View>
    </NativeRouter>
  );
};