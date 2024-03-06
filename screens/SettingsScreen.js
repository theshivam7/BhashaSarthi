import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function SettingsScreen({ navigation }) {
  const handleOptionPress = (option) => {
    switch (option) {
      case 'Feedback':
        break;
      case 'About Us':
        break;
      case 'Terms and Conditions':
        break;
      case 'Privacy Policy':
        break;
      case 'FAQs':
        break;
      default:
        break;
    }
  };

  const settingsOptions = ['Feedback', 'About Us', 'Terms and Conditions', 'Privacy Policy', 'FAQs'];

  return (
    <View style={styles.container}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => handleOptionPress(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
