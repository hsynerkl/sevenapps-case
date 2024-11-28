import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RickAndMorty from "@/components/RickAndMorty";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#5eead4", "#10b981"]}
        start={{ x: 0, y: 0 }}
        style={{ flex: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <RickAndMorty />
        </SafeAreaView>
      </LinearGradient>
    </QueryClientProvider>
  );
}
