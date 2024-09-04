import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import LanguageItem from '../components/LanguageItem';
import colors from '../utils/colors';
import supportedLanguages from '../utils/supportedLanguages';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={props.color || colors.primary}
    />
  );
};

export default function LanguageSelectScreen({ navigation, route }) { 
  const params = route.params || {};
  const { title, selected, mode } = params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconName="close"
            color={colors.textColor}
            onPress={() => navigation.goBack()}
          />
        </HeaderButtons>
      )
    });
  }, [navigation, title]);

  const onLanguageSelect = useCallback(itemKey => {
    const dataKey = mode === 'to' ? 'lang_to' : 'lang_from';
    navigation.navigate("Home", { [dataKey]: itemKey });
  }, [mode, navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(supportedLanguages)}
        renderItem={({ item: languageKey }) => (
          <LanguageItem
            onPress={() => onLanguageSelect(languageKey)}
            text={supportedLanguages[languageKey]}
            selected={languageKey === selected}
          />
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});