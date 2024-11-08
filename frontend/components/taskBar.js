import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TaskBar component tarkoitettu Androidille, koska iOS:ssä on oma alapalkki ja se näyttää paremmalta

const TaskBar = ({darkMode}) => {
    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#333' : '#6200EE' }]}>
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