import { useTheme } from "@react-navigation/native";
import { View, ViewProps } from "react-native";

export default function ThemedView({style, ...rest}: ViewProps) {
    const theme = useTheme();

    return <View style={[
        style,
        {
            backgroundColor: theme.colors.background,
        }
    ]} {...rest} />

}