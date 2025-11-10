import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff"
    },
    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#fff"
    },
});

export default function Workout() {
    const { id } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Workout</Text>
            <Text style={styles.text}>{id}</Text>
            <Link href="/(tabs)/logs" style={styles.button}>
                Home
            </Link>
        </View>
    );
}
