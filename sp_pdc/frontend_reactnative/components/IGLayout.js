import { useState } from 'react';
import { Text, View, TextInput, ScrollView, Image, Button, FlatList, Alert, Pressable, SafeAreaView, useWindowDimensions } from 'react-native';
import {styles} from '../styles/styles';

export default function IGLayout() {

    const {height, width} = useWindowDimensions();

    return (
        <View style={{justifyContent: 'center', borderWidth: 1, flex: 1, paddingBottom: 10}}>
            
            {/* header */}
            <View style={{flexDirection: 'row', borderWidth: 1}}>
                <Image style={{margin: 5, width: 60, height: 60}}
                source={require('../assets/snack-icon.png')}
                />
                <View style={{flex: 1, flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Username</Text>
                    <Text>Placehere</Text>
                </View>
                <Image style={{margin: 5, width: 60, height: 60}}
                source={require('../assets/snack-icon.png')}
                />
            </View>

            {/* pic */}
            <View style={{flex: 1, borderWidth: 1}}>
                <Image style={{flex: 1, margin: 5, width: width}}
                source={require('../assets/snack-icon.png')}
                resizeMode='stretch'
                />
            </View>

            {/* buttons */}
            <View style={{flexDirection: 'row'}}>
                <Image style={{margin: 5, marginRight: 10, width: 40, height: 40}}
                    source={require('../assets/snack-icon.png')}
                />
                <Image style={{margin: 5, marginRight: 10, width: 40, height: 40}}
                    source={require('../assets/snack-icon.png')}
                />
                <Image style={{margin: 5, marginRight: 10, width: 40, height: 40}}
                    source={require('../assets/snack-icon.png')}
                />

                <Image style={{margin: 5, marginRight: 10, width: 40, height: 40}}
                    source={require('../assets/snack-icon.png')} alt='ellipsis'
                />

                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                    <Image style={{margin: 5, marginRight: 20, width: 40, height: 40}}
                    source={require('../assets/snack-icon.png')}
                    />
                </View>
            </View>

            {/* bottom text */}
            <View style={{margin: 5}}>
                <Text style={{fontWeight: 'bold', color: 'grey', fontSize: 18}}>10,328 views</Text>
                <Text style={{color: '#767676', fontSize: 18}}><Text style={{fontWeight: 'bold', color: 'grey'}}>Username: </Text>instagram template <Text style={{fontWeight: 'bold', color: '#0044CC'}}>#template</Text></Text>
                <Text style={{color: '#878787', fontSize: 18}} onPress={() => {console.log('View all comments')}}>View all 328 comments</Text>
                <Text style={{color: '#989898'}}>5 DAYS AGO</Text>
            
            </View>
        </View>
    )
};