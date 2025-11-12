import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureResponderEvent, Pressable } from "react-native";

export type AddItemButtonProps = {
    onPress: (event: GestureResponderEvent) => void,
}
export default function AddItemButton(props: AddItemButtonProps) {
    return (
        <Pressable
            style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                height: 50,
                width: 50,
                backgroundColor: "#fff",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
            }}
            onPress={props.onPress}
        >
            <Ionicons name="add-outline" size={32} />
        </Pressable>
    );
}