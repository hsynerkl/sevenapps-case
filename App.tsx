import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  StatusBarProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RickAndMorty from "@/components/RickAndMorty";

const queryClient = new QueryClient();

interface CustomStatusBarProps extends StatusBarProps {
  customBackgroundColor?: string;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  customBackgroundColor = "white",
  ...props
}) => {
  return <RNStatusBar {...props} backgroundColor={customBackgroundColor} />;
};

export default function App() {
  const statusBarHeight =
    Platform.OS === "android" ? RNStatusBar.currentHeight ?? 0 : 0;

  return (
    <QueryClientProvider client={queryClient}>
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
            paddingTop: statusBarHeight + 5,
          }}
        >
          <RickAndMorty />
        </SafeAreaView>
      </LinearGradient>
    </QueryClientProvider>
  );
}
