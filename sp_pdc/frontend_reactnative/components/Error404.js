import { View, Text } from 'react-native';

const Error404 = () => {
    return (
        <View style={{padding: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, paddingBottom: 10}}>404 Not Found.</Text>
            <Text>The page you are looking for does not exist. </Text>
            <Text>Please return to the Home page.</Text>
        </View>
    )
};

export default Error404;