import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Download from './Download';
import FileSystem from './FileSystem';
import TopTab from './TopTab';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'rgb(0,163,224)',
        headerShown: false,
        tabBarLabelStyle: {fontSize: 13, fontWeight: "800"},
        tabBarActiveBackgroundColor:"rgb(153,195,255)",
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgb(0,0,0)',
          bottom: 10,
          left: 20,
          right: 20,
          height: 65, 
          borderRadius: 20, 
          paddingBottom:7, 
          paddingTop: 7,   
        },
        tabBarItemStyle:{
          borderRadius:10,
          marginLeft:8,
          marginRight:8,
         },
      }}
     
      initialRouteName="FileSystem">
      <Tab.Screen
        name="BioMetric"
        component={TopTab}
        options={{
          tabBarLabel: 'BioMetric',
          tabBarIcon: ({color, size, focused}) => {
            const icon = focused ? (
              <FontAwesome5Icon name="fingerprint" color={color} size={size} />
            ) : (
              <FontAwesome5Icon name="fingerprint" size={size} color={color}  />
            );
            return icon;
          },
        }}
      />
      <Tab.Screen
        name="FileSystem"
        component={FileSystem}
        options={{
          tabBarLabel: 'FileSystem',
          tabBarIcon: ({color, size, focused}) => {
            const icon = focused ? (
              <FontAwesome name="file" color={color} size={size} />
            ) : (
              <FontAwesome name="file" color={color} size={size} />
            );
            return icon;
          },
        }}
      />
      <Tab.Screen
        name="Download"
        component={Download}
        options={{
          tabBarLabel: 'Download',
          tabBarIcon: ({color, size, focused}) => {
            const icon = focused ? (
              <FontAwesome5Icon
                name="cloud-download-alt"
                color={color}
                size={size}
              />
            ) : (
              <FontAwesome5Icon
                name="cloud-download-alt"
                color={color}
                size={size}
              />
            );
            return icon;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
 
});
