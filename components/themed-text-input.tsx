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
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 15,
            paddingRight: 15,
        },
        style,
    ]} {...rest} />
};