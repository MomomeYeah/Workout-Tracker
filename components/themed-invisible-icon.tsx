import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

export default function ThemedInvisibleIcon() {
    const theme = useTheme();

    return (
        <Ionicons
            style={{color: theme.colors.background}}
            name="ellipsis-vertical-sharp"
            size={32}
        />
    );
}