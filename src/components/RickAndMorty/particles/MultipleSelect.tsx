import { FC, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCharacterStore } from "@/store/useCharacterStore";
import useDebounce from "@/hooks/useDebounce";
import { Character } from "@/types/rickAndMorty";

const MultipleSelect: FC = () => {
  const {
    selectedCharacters,
    addCharacter,
    removeCharacter,
    query,
    setQuery,
    characters,
    isLoading,
    isInputFocused,
    hasNextPage,
    fetchNextPage,
    resetCharacters,
    fetchCharacters,
    setIsInputFocused,
  } = useCharacterStore();
  const debouncedQuery: string = useDebounce(query, 500);

  const handleSelect = useCallback(
    (character: Character): void => {
      if (selectedCharacters.some((item) => item.id === character.id)) {
        removeCharacter(character.id);
      } else {
        addCharacter(character);
      }
    },
    [selectedCharacters, addCharacter, removeCharacter]
  );

  const combinedCharacters: Character[] = [
    ...(selectedCharacters as Character[]),
    ...(characters.filter(
      (char) => !selectedCharacters.some((selChar) => selChar.id === char.id)
    ) as Character[]),
  ];

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Character>) => {
      const queryLowerCase = query.toLowerCase();
      const nameLowerCase = item.name.toLowerCase();

      const startIndex = nameLowerCase.indexOf(queryLowerCase);

      const highlightText = () => {
        if (startIndex === -1) {
          return <Text className="text-gray-800 text-base">{item.name}</Text>;
        }

        const beforeMatch = item.name.slice(0, startIndex);
        const match = item.name.slice(startIndex, startIndex + query.length);
        const afterMatch = item.name.slice(startIndex + query.length);

        return (
          <Text className="text-gray-800 text-base">
            {beforeMatch}
            <Text className="font-bold text-black">{match}</Text>
            {afterMatch}
          </Text>
        );
      };

      return (
        <TouchableOpacity
          className={`flex-row items-center p-4 border-b border-gray-100 ${
            selectedCharacters.some((char) => char.id === item.id)
              ? "bg-emerald-100"
              : "bg-white"
          }`}
          onPress={() => handleSelect(item)}
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.name}`}
        >
          <Image
            source={{ uri: item.image }}
            className="w-16 h-16 rounded-full mr-3"
            accessibilityLabel={`Image of ${item.name}`}
          />

          <View className="flex-1">
            {highlightText()}
            <Text className="text-gray-600 text-sm">
              Bölüm Sayısı: {item.episode.length}
            </Text>

            <View
              className={`h-4 w-4 mt-1 rounded-full ${
                item.status === "Alive" ? "bg-emerald-400" : "bg-red-500"
              }`}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [selectedCharacters, handleSelect, query]
  );

  const keyExtractor = useCallback(
    (item: Character): string => item.id.toString(),
    []
  );

  useEffect(() => {
    resetCharacters();
    fetchCharacters();
  }, [debouncedQuery, resetCharacters, fetchCharacters]);

  return (
    <View className={`p-2.5 bg-white ${isInputFocused && "flex-1"} `}>
      <View className="bg-white border border-emerald-100 rounded-md">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
          className="max-h-32 px-2 pt-2"
          style={{ flexShrink: 1 }}
        >
          <View className="flex-row flex-wrap gap-1">
            {selectedCharacters.map((char) => (
              <TouchableOpacity
                key={char.id}
                className="bg-emerald-100 rounded-full h-10 items-center justify-center px-3 py-1"
                onPress={() => removeCharacter(char.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${char.name}`}
              >
                <Text className="text-emerald-700">{char.name} ×</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              className="flex-1 min-w-[100px] h-10 pl-3 pr-1"
              placeholder="Wubba lubba dub dub!"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                setIsInputFocused(false);
                setQuery("");
              }}
              accessibilityLabel="Search characters"
            />
          </View>
        </ScrollView>
      </View>

      {isLoading && characters.length === 0 ? (
        <ActivityIndicator size="large" color="#6ee7b7" className="mt-4" />
      ) : (
        isInputFocused && (
          <FlashList
            data={combinedCharacters}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={87}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              !isLoading && characters.length === 0 ? (
                <Text className="text-emerald-700 font-medium text-center mt-4">
                  Sonuç bulunamadı.
                </Text>
              ) : null
            }
            onEndReached={() => {
              if (hasNextPage && !isLoading) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading && characters.length > 0 ? (
                <ActivityIndicator
                  size="small"
                  color="#10B981"
                  className="my-4"
                />
              ) : null
            }
            className="mt-2 "
          />
        )
      )}
    </View>
  );
};

export default MultipleSelect;
