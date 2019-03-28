
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { View } from 'react-native';
import HamburgerIcon from './HamburgerIcon';
import { headerStyle, mainColor } from './HeaderStyle';
import AboutScreen from "../Components/About";

const AboutStackNavigator = createStackNavigator({
    About: {
        screen: AboutScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'À propos',
            headerLeft: <HamburgerIcon navigationProps={ navigation }/>,
            headerRight: <View></View>,
            headerTitleStyle: headerStyle,
            headerTintColor: mainColor,
            headerStyle: {
                backgroundColor: '#fff',
            }
        })
    },
});

export default AboutStackNavigator;