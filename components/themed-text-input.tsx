import { styles } from "@/constants/theme";
import { useTheme } from "@react-navigation/native";
import { Ref } from "react";
import { TextInput, TextInputProps } from "react-native";

type ThemedTextInputProps = TextInputProps & {
    ref?: Ref<TextInput>
}
export default function ThemedTextInput({style, ref, ...rest}: ThemedTextInputProps) {
    const theme = useTheme();

    return <TextInput ref={ref} placeholderTextColor={theme.colors.text} style={[
        {
            ...styles.input,
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            color: theme.colors.text,
        },
        style,
    ]} {...rest} />
};