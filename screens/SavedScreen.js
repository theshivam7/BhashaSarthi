import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../utils/colors';

export default function SavedScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('translationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.languagePair}>
        <Text style={styles.languageText}>{item.from} → {item.to}</Text>
      </View>
      <Text style={styles.originalText}>{item.original}</Text>
      <Text style={styles.translatedText}>{item.translated}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translation History</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No translation history yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  languagePair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  languageText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  originalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  translatedText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.lightGrey,
  },
});