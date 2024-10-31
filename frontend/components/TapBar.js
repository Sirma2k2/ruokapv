import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen'
import foodScreen from '../screens/foodScreen'
import Ionicons from "@expo/vector-icons/Ionicons"



const Tab = createBottomTabNavigator();
export default class TapBar extends Component {
  render() {
    return (
     <NavigationContainer>
        <Tab.Navigator screenOptions={{
            tabBarLabelPosition: "below-icon",
            tapBarShowLabel: true,
            tapBarActiveTintColor: "blue"

        }}>
        <Tab.Screen name="Päänäyttö" component={HomeScreen}
        options={{
            tabBarIcon: () => <Ionicons name='home' size={20} />
        }} 
        />
        <Tab.Screen name="Ruoka Näyttö" component={foodScreen}
        options={{
            tabBarIcon: () => <Ionicons name='fast-food' size={20} />
        }}
         />
        </Tab.Navigator>
        </NavigationContainer>
    

    )
  }
}