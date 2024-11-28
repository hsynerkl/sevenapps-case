import { create } from "zustand";
import axios from "axios";
import { queryClient } from "App";

interface Character {
  id: number;
  name: string;
}

interface CharactersResponse {
  info: {
    next: string | null;
  };
  results: Character[];
}

interface CharacterStore {
  selectedCharacters: Character[];
  addCharacter: (character: Character) => void;
  removeCharacter: (characterId: number) => void;

  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;

  query: string;
  setQuery: (query: string) => void;

  characters: Character[];
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;

  fetchCharacters: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  resetCharacters: () => void;
  clearCharacters: () => void;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  selectedCharacters: [],
  isInputFocused: false,
  query: "",
  characters: [],
  page: 1,
  hasNextPage: true,
  isLoading: false,

  addCharacter: (character) =>
    set((state) => ({
      selectedCharacters: [...state.selectedCharacters, character],
    })),

  removeCharacter: (characterId) =>
    set((state) => ({
      selectedCharacters: state.selectedCharacters.filter(
        (char) => char.id !== characterId
      ),
    })),

  setQuery: (query) => set({ query }),
  setIsInputFocused: (focused) => set({ isInputFocused: focused }),

  fetchCharacters: async () => {
    const { query, page, characters } = get();

    set({ isLoading: true });

    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["characters", query, page],
        queryFn: async () => {
          const response = await axios.get<CharactersResponse>(
            "https://rickandmortyapi.com/api/character",
            {
              params: query ? { page, name: query } : { page },
            }
          );
          return response.data;
        },
        staleTime: Infinity,
      });

      const newCharacters = data.results;
      const nextPageExists = data.info.next !== null;

      set({
        characters:
          page === 1 ? newCharacters : [...characters, ...newCharacters],
        hasNextPage: nextPageExists,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({ isLoading: false, hasNextPage: false });
    }
  },

  fetchNextPage: async () => {
    if (!get().hasNextPage || get().isLoading) return;
    set((state) => ({ page: state.page + 1 }));
    await get().fetchCharacters();
  },

  resetCharacters: () => {
    set({ characters: [], page: 1, hasNextPage: true });
    get().fetchCharacters();
  },

  clearCharacters: () => {
    set({ characters: [], page: 1, hasNextPage: false, isLoading: false });
  },
}));
