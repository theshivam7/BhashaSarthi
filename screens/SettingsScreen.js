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
                try {
                  await AsyncStorage.removeItem('translationHistory');
                  Alert.alert("Success", "Translation history cleared.");
                  // Notify SavedScreen to refresh its data
                  navigation.navigate('Saved', { refresh: true });
                } catch (error) {
                  console.error('Error clearing history:', error);
                  Alert.alert("Error", "Failed to clear translation history.");
                }
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
          "BhashaSarthi is a React Native Expo app created for translating Indian languages. It's available on Android, iOS, and the web.\n\nAbout the Developer:\nI'm Shivam Sharma, an undergrad at IIT Madras. I develop websites and apps for Android and iOS, and I'm passionate about AI and ML.\n\nContact Me:\nIf you have any questions, feel free to reach out on LinkedIn or check out my GitHub for interesting projects.\n\n\"This is my first app, made in 9 months! 😊 It took so long because of many challenges that made me want to give up, but I persevered and finally finished!\"",
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
    { title: 'Clear History', icon: 'delete' },
    { title: 'Feedback', icon: 'feedback' },
    { title: 'About Us', icon: 'info' },
    { title: 'Terms and Conditions', icon: 'description' },
    { title: 'Privacy Policy', icon: 'security' }
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => handleOptionPress(option.title)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <MaterialIcons name={option.icon} size={24} color={colors.primary} style={styles.optionIcon} />
            <Text style={styles.optionText}>{option.title}</Text>
          </View>
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
    backgroundColor: '#f5f5f5',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: colors.textColor,
    fontWeight: '500',
  },
  footerContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: colors.textColor,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});