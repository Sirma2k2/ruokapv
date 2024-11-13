import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen'
import foodScreen from '../screens/foodScreen'
import Ionicons from "@expo/vector-icons/Ionicons"
import FoodScreen from '../screens/foodScreen';
import MyScreen from '../screens/MyScreen';
import AppNavi from '../navigation/MyStack'



const Tab = createBottomTabNavigator();
export default class TapBar extends Component {
  render() {
    return (
   
        <Tab.Navigator screenOptions={{
            tabBarLabelPosition: "below-icon",
            tapBarShowLabel: true,
            tapBarActiveTintColor: "blue"

        }}>
        <Tab.Screen name="Home" component={HomeScreen}
        options={{
            tabBarIcon: () => <Ionicons name='home' size={20} />
        }} 
        />
        <Tab.Screen name="Food diary" component={foodScreen}
        options={{
            tabBarIcon: () => <Ionicons name='fast-food' size={20} />
        }}
         />
         <Tab.Screen name="Profile" component={AppNavi}
        options={{
            tabBarIcon: () => <Ionicons name='accessibility' size={20} />
        }}
         />
        </Tab.Navigator>
        
    

    )
  }
}
