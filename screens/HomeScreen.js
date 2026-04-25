import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Share,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import {
  useAudioRecorder,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  RecordingPresets,
} from 'expo-audio';
import { readAsStringAsync, deleteAsync } from 'expo-file-system/legacy';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';
import { GEMINI_API_KEY } from '@env';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
const MAX_CHARS = 500;
const CHAR_WARN  = 400;

export default function HomeScreen({ navigation, route }) {
  const [enteredText, setEnteredText]   = useState('');
  const [resultText, setResultText]     = useState('');
  const [languageTo, setLanguageTo]     = useState('hi');
  const [languageFrom, setLanguageFrom] = useState('en');
  const [isLoading, setIsLoading]       = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);

  const copiedOpacity   = useRef(new Animated.Value(0)).current;
  const resultOpacity   = useRef(new Animated.Value(0)).current;
  const resultTranslate = useRef(new Animated.Value(12)).current;
  const pulseAnim       = useRef(new Animated.Value(1)).current;
  const isTogglingRef   = useRef(false);
  const recorder        = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    loadLastTranslation();
    return () => { Speech.stop(); };
  }, []);

  useEffect(() => {
    if (route.params?.lang_to)   setLanguageTo(route.params.lang_to);
    if (route.params?.lang_from) setLanguageFrom(route.params.lang_from);
  }, [route.params?.lang_to, route.params?.lang_from]);

  // Pulse animation for recording dot
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.6, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const animateResultIn = () => {
    resultOpacity.setValue(0);
    resultTranslate.setValue(12);
    Animated.parallel([
      Animated.timing(resultOpacity,   { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(resultTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // ─── Storage ──────────────────────────────────────────────────────────────────

  const loadLastTranslation = async () => {
    try {
      const last = await AsyncStorage.getItem('lastTranslation');
      if (last) {
        const { from, to, original, translated } = JSON.parse(last);
        setLanguageFrom(from);
        setLanguageTo(to);
        setEnteredText(original);
        setResultText(translated);
      }
    } catch (e) {
      console.error('loadLastTranslation:', e);
    }
  };

  const saveTranslation = async (original, translated) => {
    try {
      const entry = { from: languageFrom, to: languageTo, original, translated, timestamp: Date.now() };
      await AsyncStorage.setItem('lastTranslation', JSON.stringify(entry));
      const raw = await AsyncStorage.getItem('translationHistory');
      const history = raw ? JSON.parse(raw) : [];
      history.unshift(entry);
      if (history.length > 50) history.pop();
      await AsyncStorage.setItem('translationHistory', JSON.stringify(history));
    } catch (e) {
      console.error('saveTranslation:', e);
    }
  };

  // ─── Gemini ───────────────────────────────────────────────────────────────────

  const callGemini = async (body, retries = 3, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await axios.post(
          `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
          { ...body, generationConfig: { temperature: 0.1 } },
          { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
        );
        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      } catch (err) {
        if (err.response?.status === 429 && attempt < retries) {
          await new Promise(r => setTimeout(r, delay * attempt));
          continue;
        }
        throw err;
      }
    }
  };

  // ─── Text Translation ─────────────────────────────────────────────────────────

  const handleTranslate = async () => {
    if (!enteredText.trim()) {
      Alert.alert('Empty Input', 'Please enter text to translate.');
      return;
    }
    if (!GEMINI_API_KEY) {
      Alert.alert('Setup Required', 'GEMINI_API_KEY is missing from your .env file.');
      return;
    }
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const prompt = `Translate the following text from ${supportedLanguages[languageFrom]} to ${supportedLanguages[languageTo]}. Return only the translated text, no explanations.\n\n${enteredText}`;
      const translated = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
      if (!translated) throw new Error('Empty response');
      setResultText(translated);
      animateResultIn();
      saveTranslation(enteredText, translated);
    } catch (err) {
      console.error('handleTranslate:', err);
      const s = err.response?.status;
      let msg = 'Translation failed. Please try again.';
      if (s === 429)                        msg = 'Rate limit reached. Wait a moment and try again.';
      else if (s === 403)                   msg = 'API key invalid. Check your .env file.';
      else if (err.code === 'ECONNABORTED') msg = 'Request timed out. Check your connection.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Voice Input ──────────────────────────────────────────────────────────────

  const handleVoiceInput = async () => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;
    try {
      if (isRecording) { await stopRecording(); }
      else             { await startRecording(); }
    } finally {
      isTogglingRef.current = false;
    }
  };

  const startRecording = async () => {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Required', 'Microphone access is needed for voice input. Please enable it in Settings.');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (e) {
      console.error('startRecording:', e);
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('No recording URI');

      const base64Audio = await readAsStringAsync(uri, { encoding: 'base64' });
      const prompt = `Transcribe this audio spoken in ${supportedLanguages[languageFrom]}, then translate it to ${supportedLanguages[languageTo]}. Respond ONLY with valid JSON (no markdown, no code fences): {"transcription":"...","translation":"..."}`;

      const raw = await callGemini({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: 'audio/mp4', data: base64Audio } }] }],
      });
      const cleaned = raw?.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
      const result = JSON.parse(cleaned);

      if (result?.transcription) setEnteredText(result.transcription);
      if (result?.translation) {
        setResultText(result.translation);
        animateResultIn();
        saveTranslation(result.transcription ?? '', result.translation);
      }
      await deleteAsync(uri, { idempotent: true });
    } catch (e) {
      console.error('stopRecording:', e);
      Alert.alert('Voice Input Failed', 'Could not process the recording. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── TTS ──────────────────────────────────────────────────────────────────────

  const handleSpeak = () => {
    if (!resultText) return;
    if (isSpeaking) { Speech.stop(); setIsSpeaking(false); return; }
    setIsSpeaking(true);
    Speech.speak(resultText, {
      language: languageTo,
      rate: 0.9,
      onDone:    () => setIsSpeaking(false),
      onError:   (e) => { console.error('Speech error:', e); setIsSpeaking(false); },
      onStopped: () => setIsSpeaking(false),
    });
  };

  // ─── Other ────────────────────────────────────────────────────────────────────

  const handleSwap = () => {
    setLanguageFrom(languageTo);
    setLanguageTo(languageFrom);
    setEnteredText(resultText);
    setResultText(enteredText);
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleCopy = async () => {
    if (!resultText) return;
    await Clipboard.setStringAsync(resultText);
    Animated.sequence([
      Animated.timing(copiedOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(copiedOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const handleShare = async () => {
    if (!resultText) return;
    await Share.share({ message: `${enteredText}\n\n${resultText}\n\nTranslated by BhashaSarthi` });
  };

  const charColor = enteredText.length >= CHAR_WARN ? colors.accent : colors.textMuted;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Language Selector */}
        <View style={styles.languageCard}>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => navigation.navigate('LanguageSelect', { title: 'Translate from', selected: languageFrom, mode: 'from' })}
            activeOpacity={0.7}
          >
            <Text style={styles.langLabel}>FROM</Text>
            <Text style={styles.langBtnText} numberOfLines={1}>{supportedLanguages[languageFrom]}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} activeOpacity={0.7}>
            <MaterialCommunityIcons name="swap-horizontal" size={22} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => navigation.navigate('LanguageSelect', { title: 'Translate to', selected: languageTo, mode: 'to' })}
            activeOpacity={0.7}
          >
            <Text style={styles.langLabel}>TO</Text>
            <Text style={styles.langBtnText} numberOfLines={1}>{supportedLanguages[languageTo]}</Text>
          </TouchableOpacity>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <TextInput
            multiline
            placeholder="Enter text or use voice input..."
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
            onChangeText={setEnteredText}
            value={enteredText}
            maxLength={MAX_CHARS}
            keyboardAppearance="dark"
            selectionColor={colors.accent}
          />
          <View style={styles.inputFooter}>
            {enteredText.length > 0 && (
              <TouchableOpacity onPress={() => { setEnteredText(''); setResultText(''); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            <Text style={[styles.charCount, { color: charColor }]}>
              {enteredText.length}/{MAX_CHARS}
            </Text>
            <TouchableOpacity
              onPress={handleVoiceInput}
              disabled={isLoading && !isRecording}
              style={[styles.micBtn, isRecording && styles.micBtnActive]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isRecording ? 'stop-circle' : 'mic'}
                size={20}
                color={isRecording ? colors.danger : colors.accent}
              />
            </TouchableOpacity>
          </View>

          {isRecording && (
            <View style={styles.recordingBanner}>
              <Animated.View style={[styles.recordingDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.recordingText}>Listening — tap stop when done</Text>
            </View>
          )}
        </View>

        {/* Translate Button */}
        <Pressable
          onPress={handleTranslate}
          disabled={isLoading || isRecording}
          style={({ pressed }) => [styles.translateWrapper, pressed && { opacity: 0.88 }]}
        >
          <LinearGradient
            colors={[colors.accentDark, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.translateBtn, (isLoading || isRecording) && styles.translateBtnDisabled]}
          >
            {isLoading && !isRecording ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="translate" size={18} color={colors.white} style={{ marginRight: 8 }} />
                <Text style={styles.translateBtnText}>Translate</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        {/* Result Card */}
        {resultText !== '' && (
          <Animated.View style={[styles.resultCard, { opacity: resultOpacity, transform: [{ translateY: resultTranslate }] }]}>
            <Animated.View style={[styles.copiedBanner, { opacity: copiedOpacity }]}>
              <Ionicons name="checkmark-circle" size={14} color={colors.white} />
              <Text style={styles.copiedText}>Copied to clipboard</Text>
            </Animated.View>

            <Text style={styles.resultLabel}>{supportedLanguages[languageTo]}</Text>
            <Text style={styles.resultText} selectable>{resultText}</Text>

            <View style={styles.resultActions}>
              <TouchableOpacity onPress={handleCopy} style={styles.actionBtn} activeOpacity={0.7}>
                <MaterialIcons name="content-copy" size={19} color={colors.accent} />
                <Text style={styles.actionBtnText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons name="share-outline" size={19} color={colors.accent} />
                <Text style={styles.actionBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSpeak} style={styles.actionBtn} activeOpacity={0.7}>
                <Ionicons
                  name={isSpeaking ? 'volume-mute' : 'volume-medium-outline'}
                  size={19}
                  color={isSpeaking ? colors.danger : colors.accent}
                />
                <Text style={[styles.actionBtnText, isSpeaking && { color: colors.danger }]}>
                  {isSpeaking ? 'Stop' : 'Listen'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: colors.background },
  container:  { padding: 16, paddingTop: 20, paddingBottom: 48 },

  // Language card
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  langLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Roboto-Medium',
    letterSpacing: 1,
  },
  langBtnText: {
    color: colors.accent,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    fontWeight: '600',
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },

  // Input card
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInput: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 26,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  charCount: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: colors.recordingActive,
  },
  recordingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  recordingText: {
    fontSize: 13,
    color: colors.danger,
    fontFamily: 'Roboto-Regular',
  },

  // Translate button
  translateWrapper: { marginBottom: 12, borderRadius: 14, overflow: 'hidden' },
  translateBtn: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  translateBtnDisabled: { opacity: 0.55 },
  translateBtnText: {
    color: colors.white,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // Result card
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  copiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  copiedText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    fontWeight: '600',
  },
  resultLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'Roboto-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  resultText: {
    fontFamily: 'Roboto-Regular',
    color: colors.text,
    fontSize: 20,
    lineHeight: 32,
    marginBottom: 16,
  },
  resultActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 20,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionBtnText: {
    fontSize: 14,
    color: colors.accent,
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
  },
});
