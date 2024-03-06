import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
  
  return (
    <View style={styles.container}>
      <View style={styles.languageContainer}>

        <TouchableOpacity
        style={styles.languageOption}>
        <Text style={styles.languageOptionText}> English</Text>
        </TouchableOpacity>

        <View style={styles.arrowContainer}>
          <AntDesign name="arrowright" size={24} color={colors.lightGrey} />
        </View>

        <TouchableOpacity
        style={styles.languageOption}
        onPress={() => props.navigation.navigate("LanguageSelect", {
        title: "Translate to",
        onSelectLanguage: (selectedLanguage) => setLanguageTo(selectedLanguage)
  })}
>
  <Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
</TouchableOpacity>


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
          style={styles.iconContainer}>
          <Ionicons
            name="arrow-forward-circle-sharp"
            size={24}
            color={enteredText !== '' ? colors.primary : colors.primaryDisabled}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{enteredText}</Text>

        <TouchableOpacity
          disabled={resultText === ''}
          style={styles.iconContainer}>
          <MaterialIcons
            name="content-copy"
            size={24}
            color={resultText !== '' ? colors.textColor : colors.textColorDisabled}
          />
        </TouchableOpacity>
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
  }
});
