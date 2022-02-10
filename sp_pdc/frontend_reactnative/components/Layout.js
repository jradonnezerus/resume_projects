import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, ScrollView, Image, Button, FlatList, Alert, Pressable, TouchableOpacity } from 'react-native';
import {styles} from '../styles/styles';

import { storeData, storeObject, getData, getObject, clearStorage } from '../common/Common';


const Hr = () => {
    return (<View style={{borderBottomColor: 'black', borderBottomWidth: 1,}} />);
};
  
const FlatListBasics = () => {
return (
    <View style={styles.container}>
    <FlatList
        data={[
        {key: 'Devin', age: 10, gender: 'male'},
        {key: 'Devin', age: 13, gender: 'female'},
        {key: 'Dan', age: 14, gender: 'male'},
        {key: 'Dominic', age: 16, gender: 'male'},
        {key: 'Jackson', age: 8, gender: 'female'},
        {key: 'James', age: 3, gender: 'male'},
        {key: 'Joel', age: 7, gender: 'male'},
        {key: 'John', age: 4, gender: 'female'},
        {key: 'Jillian', age: 4, gender: 'male'},
        {key: 'Jimmy', age: 11, gender: 'female'},
        {key: 'Julie', age: 17, gender: 'female'},
        ]}
        renderItem={({item}) => <Namecard style={styles.item} name={item.key} age={item.age} gender={item.gender} onPress={()=> {
            console.log(JSON.stringify(item));
            storeData("name", item.gender);
            storeObject("objectData", item);

            getData("name").then(name => console.log(name));
            getObject('objectData').then(data => console.log(data));

            clearStorage();

        }} >{item.key}</Namecard>}
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={Hr}
        />
    </View>
)};

const Namecard = ({name, age, gender, children, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{backgroundColor: age % 2? 'pink': 'orange', paddingHorizontal: 10, paddingVertical: 5}}>
                <Text style={{fontSize: 20, color: 'blue'}}>My name is <Text style={{color: 'red'}}>{name}</Text></Text>
                <Text style={{fontSize: 20, color: 'black'}}>Bio: I am a {age} year old {gender}.</Text>
                <Text>{children}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default function Layout() {

    const [text, onChangeText] = useState('Normal Text');
    const [number, onChangeNumber] = useState(null);
    const [comment, onChangeComment] = useState(null);
  
    const [timesPressed, setTimesPressed] = useState(0);
    let textLog = '';
    if (timesPressed > 1) {
      textLog = timesPressed + 'x onPress';
    } else if (timesPressed > 0) {
      textLog = 'onPress';
    }

    return (
        <View style={[{borderWidth: 1}, styles.container]}>
            {/* <StatusBar style="auto" /> */}
            {/* <Text style={{marginTop: 10}}>Open up App.js to start working on your app! yay boing boomz</Text>
            <TextInput style={styles.input} value={text} onChangeText={onChangeText} />
            <TextInput style={styles.input} value={number} onChangeText={onChangeNumber} placeholder='Numeric textbox' keyboardType='numeric' />
            <TextInput style={styles.input} value={'email'} placeholder='Email textbox' keyboardType='email-address' />
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                <TextInput style={{borderWidth: 1, padding: 10, flex: 2, marginHorizontal: 5}} value={comment} onChangeText={onChangeComment} multiline={true} numberOfLines={4} placeholder="TextArea" maxLength={10}/>
                <View style={{flex: 1}}>
                    <Button title={'Add!'} color={'red'}/>
                </View>
            </View>
            <TextInput style={{borderWidth: 1, padding: 10, marginHorizontal: 10}} value={comment} onChangeText={onChangeComment} multiline={true} numberOfLines={3} placeholder='Text Area' maxLength={100}/>
    
            <View style={{flex: 3, backgroundColor: 'green'}}>  
                <ScrollView 
                // horizontal
                >
                    <Text style={{fontSize: 30}}>Profile Pic</Text>
                    <Image style={{margin: 5, height: 300, width: 300}} source={require('../assets/websiteheader.png')}/>
                    <Image style={{margin: 5, height: 300, width: 300}} source={require('../assets/websiteheader.png')}/>
                    <Image style={{margin: 5, height: 300, width: 300}} source={require('../assets/websiteheader.png')}/>
                    <Image style={{margin: 5, height: 300, width: 300}} source={require('../assets/websiteheader.png')}/>
                </ScrollView>
            </View> */}
            
            <View style={{flex: 1, backgroundColor: 'red'}}><Text>boo!</Text></View>
            <View style={{flex: 2, backgroundColor: 'orange'}}>
                <Text style={{fontSize: 30}}>Bio: An apple a day.</Text>
                <View style={{marginHorizontal: 10, marginVertical: 20}}>
                    <Button title='Update' onPress={() => Alert.alert('Simple button pressed')}/>
                </View>
                <Pressable 
                    onPress={() => {setTimesPressed((current) => current + 1); console.log('onpress');}} 
                    onPressIn={() => console.log('press in')}
                    onPressOut={()=> console.log('press out') }
                    onLongPress={() => console.log('onlongpress')}
                    onPressOut = {() => console.log('onpressout')}

                    hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}

                    style={({pressed}) => [
                        {backgroundColor: pressed? 'rgb(210,230,255)': 'orange'},
                        styles.wrapperCustom
                    ]}>
                    {({pressed}) => (<Text style={styles.text}>{pressed? 'Pressed!': `Press Me! ${textLog}`}</Text>)}
                </Pressable>
            </View>
            {/* <FlatListBasics/>  */}


        </View>
    )
};