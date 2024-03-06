import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';

export default function HomeScreen(props) {
  const params = props.route.params || {};

  const [enteredText, setEnteredText] = useState("");
  const [resultText, setResultText] = useState("");
  const [languageTo, setLanguageTo] = useState("hi");
  const [languageFrom, setLanguageFrom] = useState("en");

  useEffect(() => {
    if (params.languageTo) {
      setLanguageTo(params.languageTo);
    }

    if (params.languageFrom) {
      setLanguageFrom(params.languageFrom);
    }
  }, [params.languageTo, params.languageFrom]);

  const handleCameraPress = () => {
    // Handle camera button press logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.languageContainer}>
        {/* ... (existing code for language selection) */}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          multiline
          placeholder="Enter text"
          style={styles.textInput}
          onChangeText={(text) => setEnteredText(text)}
        />

        <TouchableOpacity
          disabled={enteredText === ''}
          style={styles.iconContainer}
        >
          <Ionicons
            name="arrow-forward-circle-sharp"
            size={24}
            color={enteredText !== '' ? colors.primary : colors.primaryDisabled}
          />
        </TouchableOpacity>
      </View>

      {/* Camera Button */}
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={handleCameraPress}
      >
        <FontAwesome5 name="camera" size={24} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.resultContainer}>
        {/* ... (existing code for result display) */}
      </View>

      <View style={styles.historyContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  languageContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15
  },
  arrowContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOptionText: {
    color: colors.primary,
    fontFamily: 'regular',
    letterSpacing: 0.3
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  textInput: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    height: 90,
    color: colors.textColor
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultContainer: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 90,
    paddingVertical: 15
  },
  resultText: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
    color: colors.primary,
    flex: 1,
    marginHorizontal: 20
  },
  historyContainer: {
    backgroundColor: colors.greyBackground,
    flex: 1,
    padding: 10
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 10,
    elevation: 5, // Add elevation for a shadow effect (Android)
  },
});
