import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../utils/colors';

export default function SettingsScreen({ navigation }) {
  const handleOptionPress = async (option) => {
    switch (option) {
      case 'Clear History':
        Alert.alert(
          "Clear History",
          "Are you sure you want to clear your translation history?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                await AsyncStorage.removeItem('translationHistory');
                Alert.alert("Success", "Translation history cleared.");
              }
            }
          ]
        );
        break;
      case 'Feedback':
        Linking.openURL('mailto:shivam.klt77@gmail.com?subject=BhashaSarthi Feedback');
        break;
      case 'About Us':
        Alert.alert(
          "About BhashaSarthi",
         "BhashaSarthi is a React Native Expo app created for translating Indian languages. It's available on Android, iOS, and the web.\n\nAbout the Developer:\nI'm Shivam Sharma, an undergrad at IIT Madras. I develop websites and apps for Android and iOS, and I'm passionate about AI and ML.\n\nContact Me:\nIf you have any questions, feel free to reach out on LinkedIn or check out my GitHub for interesting projects.\n\n\"This is my first app, made in 9 months! 😂 It took so long because of many errors that made me want to give up, but I kept going and finally finished!\""

          [
            {
              text: "LinkedIn",
              onPress: () => Linking.openURL('https://www.linkedin.com/in/theshivam7/'),
            },
            {
              text: "GitHub",
              onPress: () => Linking.openURL('https://github.com/theshivam7/'),
            },
            { text: "OK" }
          ]
        );
        break;
      case 'Terms and Conditions':
        Alert.alert(
          "Terms and Conditions",
          "By using BhashaSarthi, you agree to abide by our terms of service. These include using the app for personal, non-commercial purposes, respecting intellectual property rights, and not engaging in any illegal activities through our platform. For a full version of our terms and conditions, please visit our website.",
          [{ text: "OK" }]
        );
        break;
      case 'Privacy Policy':
        Alert.alert(
          "Privacy Policy",
          "At BhashaSarthi, we respect your privacy. We collect minimal data necessary for app functionality and improvement. Your translations are not stored on our servers. We do not sell or share your personal information with third parties. For the complete privacy policy, please visit our website.",
          [{ text: "OK" }]
        );
        break;
      default:
        break;
    }
  };

  const settingsOptions = [
    'Clear History',
    'Feedback',
    'About Us',
    'Terms and Conditions',
    'Privacy Policy'
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => handleOptionPress(option)}
          activeOpacity={0.7}
        >
          <Text style={styles.optionText}>{option}</Text>
          <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
        </TouchableOpacity>
      ))}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Made with ❤️ by{' '}
          <Text 
            style={styles.linkText}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/theshivam7/')}
          >
            Shivam 🍁
          </Text>
        </Text>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 18,
    color: colors.textColor,
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: colors.textColor,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  contactContainer: {
    marginTop: 10,
  },
  contactLink: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
