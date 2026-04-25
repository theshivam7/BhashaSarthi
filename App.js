import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import colors from './utils/colors';

import HomeScreen from './screens/HomeScreen';
import SavedScreen from './screens/SavedScreen';
import SettingsScreen from './screens/SettingsScreen';
import LanguageSelectScreen from './screens/LanguageSelectScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

const TAB_ICONS = {
  Translate: { active: 'language', inactive: 'language-outline' },
  History: { active: 'time', inactive: 'time-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.darkGrey,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const icons = TAB_ICONS[route.name] ?? TAB_ICONS.Translate;
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Translate" component={HomeScreen} />
      <Tab.Screen name="History" component={SavedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font load error:', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer theme={NAV_THEME}>
      <View style={styles.root}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: {
              fontFamily: 'Roboto-Medium',
              color: colors.text,
              fontSize: 18,
            },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{
              headerTitle: 'BhashaSarthi',
              headerTitleStyle: { fontFamily: 'Roboto-Bold', color: colors.text, fontSize: 18 },
              headerBottom: () => (
                <View style={{ height: 2, backgroundColor: colors.accent, opacity: 0.7 }} />
              ),
            }}
          />
          <Stack.Screen
            name="LanguageSelect"
            component={LanguageSelectScreen}
            options={{ presentation: 'modal', headerTitle: 'Select Language' }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    height: Platform.OS === 'ios' ? 84 : 64,
  },
  tabLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 11,
    fontWeight: '500',
  },
});
