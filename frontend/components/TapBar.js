import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen'
import foodScreen from '../screens/foodScreen'
import Ionicons from "@expo/vector-icons/Ionicons"
import ProfileStack from '../navigation/ProfileStack';
import FoodStack from '../navigation/FoodStack';

const Tab = createBottomTabNavigator();
export default class TapBar extends Component {
    render() {
        return (
            <Tab.Navigator screenOptions={{
                    tabBarLabelPosition: "below-icon",
                    tabBarShowLabel: true,
                    tabBarActiveTintColor: "blue",
                    headerStyle: {
                        height: 30,         
                    },
                    headerTitleStyle: {
                        fontSize: 13,
                    },
            }}>
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        tabBarIcon: () => <Ionicons name='home' size={20} />
                    }} 
                />
                <Tab.Screen name="Food Diary" component={FoodStack}
                    options={{
                        tabBarIcon: () => <Ionicons name='fast-food' size={20} />
                    }}
                />
                <Tab.Screen name="Profile" component={ProfileStack}
                    options={{
                        tabBarIcon: () => <Ionicons name='accessibility' size={20} />
                    }}
                />
            </Tab.Navigator>
        )
    }
}
