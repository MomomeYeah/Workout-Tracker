import { useTheme } from "@react-navigation/native";
import { View, ViewProps } from "react-native";

export default function ThemedCard({style, ...rest}: ViewProps) {
    const theme = useTheme();

    return <View style={[
        style,
        {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
        }
    ]} {...rest} />
}