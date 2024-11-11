import * as SecureStore from 'expo-secure-store';

const key = "userData"

export function useData () {
    const saveData = async (value) => {
        await SecureStore.setItemAsync(key, JSON.stringify(value))
    }

    const getData = async () => {
        const result  = await SecureStore.getItemAsync(key)
        return result ? JSON.parse(result) : null
    }

    return { getData, saveData }
}