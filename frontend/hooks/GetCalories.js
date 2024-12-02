import { View, Text } from 'react-native'
import React, { useEffect } from 'react'


const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');

import ServerIp from '../hooks/Global';


//this is a hook to get calories
const GetCalories = () => { //BACKEND KUTSU OIKEIN TÄHÄN
useEffect(() => {
    // Fetch calories from the API
    fetch(ServerIp + '/get-food')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log('Error fetching calories:', error))
    }, [])


}

export default GetCalories;