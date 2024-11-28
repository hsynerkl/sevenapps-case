import { FC, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useCharacterStore } from "@/store/useCharacterStore";
import { Character } from "@/types/rickAndMorty";

const Characters: FC = () => {
  const {
    selectedCharacters,
    characters,
    isInputFocused,
    fetchCharacters,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useCharacterStore();

  const renderItem = ({ item }: ListRenderItemInfo<Character>) => (
    <View
      className={`flex-row items-center p-4 border-b border-gray-100 ${
        selectedCharacters.some((char) => char.id === item.id)
          ? "bg-emerald-100"
          : "bg-white"
      }`}
    >
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-full mr-3"
        accessibilityLabel={`Image of ${item.name}`}
      />

      <View className="flex-1">
        <Text className="text-gray-800 text-base">{item.name}</Text>
        <Text className="text-gray-600 text-sm">
          Bölüm Sayısı: {item.episode.length}
        </Text>

        <View
          className={`h-4 w-4 mt-1 rounded-full ${
            item.status === "Alive" ? "bg-emerald-400" : "bg-red-500"
          }`}
        />
      </View>
    </View>
  );

  const keyExtractor = useCallback((item: Character) => item.id.toString(), []);

  const combinedCharacters: Character[] = [
    ...(selectedCharacters as Character[]),
    ...(characters.filter(
      (char) => !selectedCharacters.some((selChar) => selChar.id === char.id)
    ) as Character[]),
  ];

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <View className="flex-1 px-2 bg-white">
      <FlashList
        data={combinedCharacters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isLoading) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading && !isInputFocused && hasNextPage ? (
            <ActivityIndicator size="small" color="#10B981" className="my-4" />
          ) : null
        }
      />
    </View>
  );
};

export default Characters;
