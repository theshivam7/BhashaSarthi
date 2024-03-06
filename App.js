import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import * as Font from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from './utils/colors';
import { UnavailabilityError } from '@unimodules/core';


import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SavedScreen from './screens/SavedScreen';
import LanguageSelectScreen from './screens/LanguageSelectScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: (props) => <Entypo name="home" size={props.size} color={props.color} />,
        }}
      />

      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: (props) => <Entypo name="star" size={props.size} color={props.color} />,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: (props) => <Ionicons name="settings" size={props.size} color={props.color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          black: require('./assets/fonts/Roboto-Black.ttf'),
          blackItalic: require('./assets/fonts/Roboto-BlackItalic.ttf'),
          bold: require('./assets/fonts/Roboto-Bold.ttf'),
          boldItalic: require('./assets/fonts/Roboto-BoldItalic.ttf'),
          italic: require('./assets/fonts/Roboto-Italic.ttf'),
          light: require('./assets/fonts/Roboto-Light.ttf'),
          lightItalic: require('./assets/fonts/Roboto-LightItalic.ttf'),
          medium: require('./assets/fonts/Roboto-Medium.ttf'),
          mediumItalic: require('./assets/fonts/Roboto-MediumItalic.ttf'),
          regular: require('./assets/fonts/Roboto-Regular.ttf'),
          thin: require('./assets/fonts/Roboto-Thin.ttf'),
          thinItalic: require('./assets/fonts/Roboto-ThinItalic.ttf'),
        });
      } 
      catch (e) {
        console.log(e);
      }
      finally {
        setAppIsLoaded(true);
      }
    };

    prepare();

  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <View onLayout={onLayout} style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              fontFamily: 'medium',
              color: 'white',
            },
            headerStyle: {
              backgroundColor: '#FFC107',
            },
          }}>
          <Stack.Group>
            <Stack.Screen
              name="main"
              component={TabNavigator}
              options={{
                headerTitle: 'Translate',
              }}
            />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
            <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="screen2"
              component={SettingsScreen}
              options={{
                headerTitle: 'Settings',
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});