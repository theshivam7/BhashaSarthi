import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';
import { PERPLEXITY_API_KEY } from '@env';


const API_URL = 'https://api.perplexity.ai/chat/completions';

export default function HomeScreen({ navigation, route }) {
  const [enteredText, setEnteredText] = useState('');
  const [resultText, setResultText] = useState('');
  const [languageTo, setLanguageTo] = useState('hi');
  const [languageFrom, setLanguageFrom] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLastTranslation();
  }, []);

  useEffect(() => {
    if (route.params?.lang_to) {
      setLanguageTo(route.params.lang_to);
    }
    if (route.params?.lang_from) {
      setLanguageFrom(route.params.lang_from);
    }
  }, [route.params]);

  const loadLastTranslation = async () => {
    try {
      const lastTranslation = await AsyncStorage.getItem('lastTranslation');
      if (lastTranslation) {
        const { from, to, original, translated } = JSON.parse(lastTranslation);
        setLanguageFrom(from);
        setLanguageTo(to);
        setEnteredText(original);
        setResultText(translated);
      }
    } catch (error) {
      console.error('Error loading last translation:', error);
    }
  };

  const saveLastTranslation = async () => {
    try {
      const translationData = JSON.stringify({
        from: languageFrom,
        to: languageTo,
        original: enteredText,
        translated: resultText
      });
      await AsyncStorage.setItem('lastTranslation', translationData);
      
      const history = await AsyncStorage.getItem('translationHistory') || '[]';
      const historyArray = JSON.parse(history);
      historyArray.unshift(JSON.parse(translationData));
      if (historyArray.length > 50) historyArray.pop();
      await AsyncStorage.setItem('translationHistory', JSON.stringify(historyArray));
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const handleTranslate = async () => {
    if (enteredText.trim() === '') {
      Alert.alert("Error", "Please enter text to translate.");
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const response = await axios.post(API_URL, {
        model: "llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: `You are a translation assistant. Translate the given text from ${supportedLanguages[languageFrom]} to ${supportedLanguages[languageTo]}. Only provide the translated text without any additional explanation.`
          },
          {
            role: "user",
            content: enteredText
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.choices && response.data.choices[0].message) {
        setResultText(response.data.choices[0].message.content.trim());
        saveLastTranslation();
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      console.error('Translation error:', error);
      let errorMessage = "An error occurred during translation. Please try again.";
      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage += ` (Status: ${error.response.status})`;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = async () => {
    try {
      await Clipboard.setStringAsync(resultText);
      Alert.alert("Success", "Text copied to clipboard!");
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      Alert.alert("Error", "Failed to copy text to clipboard.");
    }
  };

  const handleClearInput = () => {
    setEnteredText('');
    setResultText('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.languageContainer}>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => navigation.navigate('LanguageSelect', {
              title: 'Translate from',
              selected: languageFrom,
              mode: 'from'
            })}>
            <Text style={styles.languageOptionText}>{supportedLanguages[languageFrom]}</Text>
          </TouchableOpacity>
          <View style={styles.arrowContainer}>
            <AntDesign name="arrowright" size={24} color={colors.primary} />
          </View>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => navigation.navigate('LanguageSelect', {
              title: 'Translate to',
              selected: languageTo,
              mode: 'to'
            })}>
            <Text style={styles.languageOptionText}>{supportedLanguages[languageTo]}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Enter text to translate"
            value={enteredText}
            onChangeText={setEnteredText}
          />
          <TouchableOpacity style={styles.clearButton} onPress={handleClearInput}>
            <Ionicons name="close-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.translateButton}
        >
          <TouchableOpacity onPress={handleTranslate} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.translateButtonText}>Translate</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{resultText}</Text>
          {resultText !== '' && (
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyResult}>
              <MaterialIcons name="content-copy" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    overflow: 'hidden',
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  arrowContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOptionText: {
    color: colors.primary,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  textInput: {
    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: colors.textColor,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  clearButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  translateButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  translateButtonText: {
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  resultContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    padding: 10,
    minHeight: 150,
  },
  resultText: {
    fontFamily: 'Roboto-Regular',
    color: colors.textColor,
    fontSize: 20,
  },
  copyButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 20,
  },
});