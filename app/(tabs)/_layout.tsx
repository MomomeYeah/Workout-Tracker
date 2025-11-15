import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const activeTintColor = colorScheme === "dark" ? "#ffd33d" : "#ff723d";

    console.log(theme.colors.card)

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
        </Tabs>
    );
}
