import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffd33d",
                headerStyle: {
                    backgroundColor: "#25292e",
                },
                headerShadowVisible: false,
                headerTintColor: "#fff",
                tabBarStyle: {
                    backgroundColor: "#25292e",
                },
            }}
        >
            <Tabs.Screen
                name="logs"
                options={{
                    title: "Logs",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={24} />
                    )
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: "About",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    )
                }}
            />
            <Tabs.Screen
                name="seed"
                options={{
                    title: "Seed",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'leaf' : 'leaf-outline'} color={color} size={24} />
                    )
                }}
            />
        </Tabs>
    );
}
