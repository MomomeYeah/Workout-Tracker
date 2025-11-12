import { StyleSheet } from 'react-native';

export const backgroundColor = "#25292e";
export const foregroundColor = "#fff";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: backgroundColor,
    },
    centredFlex: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        borderWidth: 1,
        borderColor: foregroundColor,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    title: {
        color: foregroundColor,
        fontSize: 22,
        fontWeight: "bold",
    },
    text: {
        color: foregroundColor,
    },
    input: {
        color: foregroundColor,
        borderWidth: 1,
        borderColor: foregroundColor,
        padding: 10,
    },
});