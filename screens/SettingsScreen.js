import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version } from '../package.json';
import colors from '../utils/colors';

const OPTIONS = [
  { id: 'clear', title: 'Clear History', icon: 'delete-outline', lib: 'material' },
  { id: 'feedback', title: 'Send Feedback', icon: 'chatbubble-outline', lib: 'ionicon' },
  { id: 'about', title: 'About BhashaSarthi', icon: 'information-circle-outline', lib: 'ionicon' },
  { id: 'terms', title: 'Terms & Conditions', icon: 'document-text-outline', lib: 'ionicon' },
  { id: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark-outline', lib: 'ionicon' },
];

export default function SettingsScreen() {
  const handleOption = async (id) => {
    switch (id) {
      case 'clear':
        Alert.alert('Clear History', 'Remove all saved translations?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: async () => {
              await AsyncStorage.removeItem('translationHistory');
              Alert.alert('Done', 'Translation history cleared.');
            },
          },
        ]);
        break;
      case 'feedback':
        Linking.openURL('mailto:shivam.klt77@gmail.com?subject=BhashaSarthi Feedback');
        break;
      case 'about':
        Alert.alert(
          'About BhashaSarthi',
          'BhashaSarthi is a fast, accurate translation app built for Indian languages. Powered by Google Gemini 2.5 Flash, it supports Hindi, Bengali, Tamil, Telugu, Marathi, and more — all from a clean, minimal interface.\n\nBhashaSarthi is open source. Contributions and feedback are welcome.\n\nDeveloped by Shivam Sharma, a student at IIT Madras with a focus on AI, mobile, and full-stack development.\n\nVersion 2.0',
          [{ text: 'Close' }]
        );
        break;
      case 'terms':
        Alert.alert(
          'Terms & Conditions',
          'By using BhashaSarthi, you agree to the following:\n\n1. BhashaSarthi is a free, open source app available to everyone. You may use it for personal, educational, or commercial purposes.\n\n2. Translation quality depends on Google Gemini AI and may not always be perfect. Do not rely on translations for critical, medical, or legal purposes without verification.\n\n3. You must not use the app to translate content that is illegal, harmful, abusive, or violates any applicable law or platform policy.\n\n4. The developer is not liable for any inaccuracies in translations or any consequences arising from their use.\n\n5. The app is provided "as is" without any warranty. Features may change or be discontinued at any time.\n\n6. By using voice input, you consent to audio being sent to Google Gemini API for transcription and translation.',
          [{ text: 'OK' }]
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy Policy',
          'Your privacy matters to us. Here is what you should know:\n\n1. Data Storage: Translation history is stored only on your device using AsyncStorage. We do not have access to it.\n\n2. Data Transmission: Text you submit for translation is sent to Google Gemini API to perform the translation. This is governed by Google\'s Privacy Policy.\n\n3. No Personal Data Collected: We do not collect, store, or share your name, email, location, or any personal identifiers.\n\n4. No Analytics: We do not use any analytics or tracking tools in this app.\n\n5. Third-Party Services: Google Gemini API is the only third-party service used. Please review Google\'s privacy policy for details on how they handle data.\n\nFor questions, contact: shivam.klt77@gmail.com',
          [{ text: 'OK' }]
        );
        break;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        {OPTIONS.map((opt, i) => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.row, i === 0 && styles.rowFirst]}
            onPress={() => handleOption(opt.id)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIcon}>
              {opt.lib === 'material'
                ? <MaterialIcons name={opt.icon} size={22} color={colors.accent} />
                : <Ionicons name={opt.icon} size={22} color={colors.accent} />}
            </View>
            <Text style={styles.rowText}>{opt.title}</Text>
            <MaterialIcons name="chevron-right" size={20} color={colors.darkGrey} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerPowered}>Powered by Google Gemini</Text>
        <Text style={styles.footerVersion}>v{version}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/theshivam7/')}>
          <Text style={styles.footerLink}>Made by Shivam Sharma</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowFirst: { borderTopWidth: 0 },
  rowIcon: { width: 36, alignItems: 'center', marginRight: 14 },
  rowText: { flex: 1, fontSize: 15, color: colors.text, fontFamily: 'Roboto-Regular' },
  footer: { alignItems: 'center', marginTop: 36, gap: 6 },
  footerPowered: { fontSize: 13, color: colors.textMuted, fontFamily: 'Roboto-Regular' },
  footerVersion: { fontSize: 12, color: colors.darkGrey, fontFamily: 'Roboto-Regular' },
  footerLink: {
    fontSize: 13,
    color: colors.accent,
    fontFamily: 'Roboto-Medium',
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
