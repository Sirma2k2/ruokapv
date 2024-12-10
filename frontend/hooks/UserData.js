import * as SecureStore from 'expo-secure-store'; // Import SecureStore

export const getUserData = async () => {
    const storedData = await SecureStore.getItemAsync("userData");
    if (storedData){
        const user = JSON.parse(storedData);
        return user;
    }
};