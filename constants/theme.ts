import { StyleSheet } from 'react-native';

export const fontSizes = {
    h1: 22,
    h2: 18,
    h3: 16,
    input: 14,
    text: 14,
    label: 12,
}

export const styles = StyleSheet.create({
    h1: {
        fontSize: fontSizes.h1,
        fontWeight: "bold",
    },
    h2: {
        fontSize: fontSizes.h2,
        fontWeight: "bold",
    },
    h3: {
        fontSize: fontSizes.h3,
        fontWeight: "bold",
    },
    input: {
        fontSize: fontSizes.input,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
});