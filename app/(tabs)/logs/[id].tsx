import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Link, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
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
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [log, setLog] = useState<schema.LogsTableSelectType | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const log = await logDB
                .query.LogsTable.findFirst({
                    where: eq(schema.LogsTable.id, +id),
                    with: {
                        exercises: true
                    }
                });
            setLog(log);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Workout</Text>
            <Text style={styles.text}>
                {JSON.stringify(log, null, 2)}
            </Text>
            <Link href="/(tabs)/logs" style={styles.button}>
                Home
            </Link>
        </View>
    );
}
