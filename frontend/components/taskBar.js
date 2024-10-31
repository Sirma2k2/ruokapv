import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const TaskBar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Task Bar</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});
export default TaskBar;