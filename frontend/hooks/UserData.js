import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import ServerIp from './Global';
import { use } from 'react';

export const getUserData = async () => {
    const storedData = await SecureStore.getItemAsync("userData");
    if (storedData){
        const user = JSON.parse(storedData);
        return user;
    }
};

export const saveUserDataApi = async (userData) => {
    console.log("SENDING DATA: ", userData.aktiviteetti, userData.tavoite, userData.tyyppi);
    const response = await fetch(ServerIp + '/api/update-user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            knimi: userData.knimi,
            aktiviteetti: userData.aktiviteetti,
            tyyppi: userData.tyyppi,
            tavoite: userData.tavoite,
        }),
    });
};