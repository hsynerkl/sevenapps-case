import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  StatusBarProps,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RickAndMorty from "@/components/RickAndMorty";
import { FC } from "react";

const queryClient = new QueryClient();

interface CustomStatusBarProps extends StatusBarProps {
  customBackgroundColor?: string;
}

const CustomStatusBar: FC<CustomStatusBarProps> = ({
  customBackgroundColor = "transparent",
  ...props
}) => {
  return <RNStatusBar {...props} backgroundColor={customBackgroundColor} />;
};

export default function App() {
  const statusBarHeight =
    Platform.OS === "android" ? RNStatusBar.currentHeight : 0;

  return (
    <View className="flex-1">
      <CustomStatusBar barStyle="light-content" translucent />

      <LinearGradient
        colors={["#5eead4", "#10b981"]}
        start={{ x: 0, y: 0 }}
        style={{ flex: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView
          className="flex-1 bg-transparent"
          style={{
            paddingTop: statusBarHeight ?? 0,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <RickAndMorty />
          </QueryClientProvider>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
