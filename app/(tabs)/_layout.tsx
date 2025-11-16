import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const activeTintColor = colorScheme === "dark" ? "#ffd33d" : "#ff723d";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeTintColor,
                headerStyle: {
                    backgroundColor: theme.colors.card,
                },
                headerShown: false,
                headerShadowVisible: false,
                headerTintColor: theme.colors.text,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                },
            }}
        >
            <Tabs.Screen
                name="logs"
                options={{
                    title: "Logs",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={24} />
                    ),
                    popToTopOnBlur: true,
                }}
            />
            <Tabs.Screen
                name="exercises"
                options={{
                    title: "Exercises",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'bicycle' : 'bicycle-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="seed"
                options={{
                    title: "Seed",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'leaf' : 'leaf-outline'} color={color} size={24} />
                    ),
                }}
            />
            {/* Android build appears to require the existence of an index route directly under (tabs) */}
            {/* in order to be able to navigate to logs/index. We guard here to prevent it from appearing */}
            {/* in the UI */}
            <Tabs.Protected guard={false}>
                <Tabs.Screen name="index" />
            </Tabs.Protected>
        </Tabs>
    );
}
