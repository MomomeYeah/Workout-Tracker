import { useTheme } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
    const theme = useTheme();
    
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Link
                    href="/logs"
                    style={{
                        fontSize: 20,
                        textDecorationLine: 'underline',
                        color: theme.colors.text,
                    }}
                >
                    Go back to Home screen!
                </Link>
            </View>
        </>
    );
}