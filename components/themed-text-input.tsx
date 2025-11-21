import { fontSizes, styles } from "@/constants/theme";
import { useTheme } from "@react-navigation/native";
import { Ref } from "react";
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import ThemedText from "./themed-text";

type ThemedTextInputProps = TextInputProps & {
    containerStyle?: StyleProp<ViewStyle>,
    label?: string,
    ref?: Ref<TextInput>
}
export default function ThemedTextInput({style, containerStyle, label, ref, ...rest}: ThemedTextInputProps) {
    const theme = useTheme();

    return (
        <View style={containerStyle}>
            {
                label && <ThemedText style={{fontSize: fontSizes.label, paddingLeft: 5, paddingBottom: 3}}>{label}</ThemedText>
            }
            <TextInput
                ref={ref}
                placeholderTextColor={theme.colors.text}
                style={[
                    {
                        ...styles.input,
                        backgroundColor: theme.colors.background,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                    },
                    style,
                ]}
                {...rest}
            />
        </View>
    );
};