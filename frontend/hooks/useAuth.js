// import { useState, useEffect } from 'react';
// import * as SecureStore from 'expo-secure-store';
// //useAuth hook for checking if the user is logged in
// const useAuth = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(null);
//     const [isFirstLaunch, setIsFirstLaunch] = useState(null);

//     useEffect(() => {
//         const checkAuthStatus = async () => {
//             // Check if the user is logged in
//             const storedLoginStatus = await SecureStore.getItemAsync('isLoggedIn');
//             const storedFirstLaunch = await SecureStore.getItemAsync('isFirstLaunch');

//             setIsLoggedIn(storedLoginStatus === 'true');
//             setIsFirstLaunch(storedFirstLaunch === null);

//             if (storedFirstLaunch === null) {
//                 await SecureStore.setItemAsync('isFirstLaunch', 'false'); // Mark as not first launch after checking
//             }
//         };

//         checkAuthStatus();
//     }, []);

//     const login = async () => {
//         await SecureStore.setItemAsync('isLoggedIn', 'true');
//         setIsLoggedIn(true);
//     };

//     const logout = async () => {
//         await SecureStore.setItemAsync('isLoggedIn', 'false');
//         setIsLoggedIn(false);
//     };

//     return { isLoggedIn, isFirstLaunch, login, logout };
// };

// export default useAuth;
