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



async function storeData() { // Tallennus
    try {
      await AsyncStorage.setItem('user',
         JSON.stringify({ name: 'John', age: 30 }));
      console.log('Data tallennettu');
    } catch (error) {
      console.error('Virhe tallennuksessa:', error);
    }}
  
  async function readData() { // Lukeminen
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        const user = JSON.parse(value);
        console.log('Tallennettu käyttäjä:', user);
      } else {
        console.log('Ei dataa löytynyt');
      }
    } catch (error) {
      console.error('Virhe lukemisessa:', error);
    }}