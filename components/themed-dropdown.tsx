import { styles } from "@/constants/theme";
import { useTheme } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThemedDropdown({style, ...rest}: DropdownProps<any>) {
    let theme = useTheme();
    const insets = useSafeAreaInsets();

    return <Dropdown
        style={[
            {
                ...styles.input,
                borderWidth: 1,
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
            },
            style,
        ]}
        placeholderStyle={{
            color: theme.colors.text,
            fontSize: 14,
        }}
        selectedTextStyle={{
            color: theme.colors.text,
            fontSize: 14,
        }}
        containerStyle={{
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            borderColor: theme.colors.border,
            // according to issues raised on their GitHub, react-native-element-dropdown
            // does not properly respect safe area insets when calculating container
            // position, so account for this here
            marginTop: -insets.top
        }}
        itemTextStyle={{
            color: theme.colors.text,
        }}
        maxHeight={300}
        {...rest} />
};