import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';


export default function AssetApp() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://cataas.com/c/s/Hello?id=2' }}
          resizeMode="contain"
          style={{flex: 1}}
        />
      </View>
      <View>
        <Text style={styles.viewContainer}>1234 Views</Text>
        
        <Text><Text style={styles.posterContainer}>Tom12345</Text> Meow🐱🐱🐱, This is a cute cat I saw by the road. </Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  imageContainer: {
    flex: 0.5,
    marginBottom: 5,
  },
  posterContainer: {
    fontWeight: "bold"
  },
  viewContainer: {
    fontWeight: "bold",
    marginBottom: 10
  }
};
