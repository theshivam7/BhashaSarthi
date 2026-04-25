import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';

export default function SavedScreen() {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('translationHistory');
      setHistory(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadHistory(); }, [loadHistory]));

  const deleteItem = (index) => {
    Alert.alert('Delete', 'Remove this translation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = history.filter((_, i) => i !== index);
          await AsyncStorage.setItem('translationHistory', JSON.stringify(updated));
          setHistory(updated);
        },
      },
    ]);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.langPill}>
          <Text style={styles.langPillText}>{supportedLanguages[item.from] || item.from}</Text>
          <MaterialIcons name="arrow-forward" size={12} color={colors.accent} style={{ marginHorizontal: 4 }} />
          <Text style={styles.langPillText}>{supportedLanguages[item.to] || item.to}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteItem(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="delete-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </View>
      <Text style={styles.originalText} numberOfLines={3}>{item.original}</Text>
      <View style={styles.divider} />
      <Text style={styles.translatedText} numberOfLines={3}>{item.translated}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="time-outline" size={40} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptySubtitle}>Your translations will appear here</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langPillText: { fontSize: 12, color: colors.accent, fontFamily: 'Roboto-Medium', fontWeight: '600' },
  originalText: { fontSize: 15, color: colors.text, fontFamily: 'Roboto-Regular', lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  translatedText: { fontSize: 15, color: colors.textMuted, fontFamily: 'Roboto-Regular', fontStyle: 'italic', lineHeight: 22 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Roboto-Medium', fontWeight: '600', color: colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, fontFamily: 'Roboto-Regular', textAlign: 'center' },
});
