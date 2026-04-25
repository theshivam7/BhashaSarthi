import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LanguageItem from '../components/LanguageItem';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';

export default function LanguageSelectScreen({ navigation, route }) {
  const { title, selected, mode } = route.params || {};
  const [query, setQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || 'Select Language',
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title]);

  const filtered = useMemo(() => {
    const keys = Object.keys(supportedLanguages);
    if (!query.trim()) return keys;
    const q = query.toLowerCase();
    return keys.filter((k) => supportedLanguages[k].toLowerCase().includes(q));
  }, [query]);

  const onSelect = useCallback(
    (key) => {
      const paramKey = mode === 'to' ? 'lang_to' : 'lang_from';
      navigation.navigate('Main', {
        screen: 'Translate',
        params: { [paramKey]: key },
      });
    },
    [mode, navigation]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search language..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardAppearance="dark"
        />
      </View>
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <LanguageItem
            text={supportedLanguages[item]}
            selected={item === selected}
            onPress={() => onSelect(item)}
          />
        )}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: 30 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, fontFamily: 'Roboto-Regular' },
  closeBtn: { padding: 4, marginRight: 4 },
});
