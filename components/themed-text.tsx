import { useTheme } from "@react-navigation/native";
import { Text, TextProps } from "react-native";

export default function ThemedText({style, ...rest}: TextProps) {
    const theme = useTheme();

    return <Text style={[
        style,
        {
            color: theme.colors.text,
        }
    ]} {...rest} />
}