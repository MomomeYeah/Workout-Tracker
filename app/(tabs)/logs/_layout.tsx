import { foregroundColor, styles } from "@/constants/theme";
import { Stack } from "expo-router";

export default function LogsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: true,
                    headerStyle: {
                        ...styles.container,
                    },
                    headerTintColor: foregroundColor,
                    headerTitle: "",
                }}
            />
        </Stack>
    );
}
