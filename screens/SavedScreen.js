import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../utils/colors';

export default function SavedScreen({ route }) {
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('translationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert("Error", "Failed to load translation history.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  useEffect(() => {
    if (route.params?.refresh) {
      loadHistory();
    }
  }, [route.params?.refresh, loadHistory]);

  const deleteHistoryItem = async (index) => {
    try {
      const newHistory = history.filter((_, i) => i !== index);
      await AsyncStorage.setItem('translationHistory', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
      Alert.alert("Error", "Failed to delete history item.");
    }
  };

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyItem}>
      <View style={styles.languagePair}>
        <Text style={styles.languageText}>{item.from} → {item.to}</Text>
        <TouchableOpacity onPress={() => deleteHistoryItem(index)}>
          <MaterialIcons name="delete" size={24} color={colors.danger} />
        </TouchableOpacity>
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
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={48} color={colors.lightGrey} />
          <Text style={styles.emptyText}>No translation history yet.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  languagePair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  languageText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  originalText: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.textColor,
  },
  translatedText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.lightGrey,
    marginTop: 10,
  },
});