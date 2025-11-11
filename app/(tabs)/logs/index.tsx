import * as schema from "@/db/schema";
import Ionicons from '@expo/vector-icons/Ionicons';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        padding: 5,
    },
    workout: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 0,
        marginBottom: 10,
    },
    item: {
        color: "#fff",
    },
});

function Workout(item: schema.LogsTableSelectType) {
    const router = useRouter();

    const startTime = new Date(item.startTime);
    const endTime = item.endTime ? new Date(item.endTime) : null;
    const durationMins = item.endTime ? (item.endTime - item.startTime) / 1000 / 60 : null;
    const duration = durationMins ? `${durationMins} mins` : "";

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEV"];

    async function gotoWorkout() {
        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: item.id,
            },
        });
    }

    return (
        <Pressable style={styles.workout} onPress={gotoWorkout}>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={styles.item}>{daysOfWeek[startTime.getDay()]}</Text>
                <Text style={styles.item}>{startTime.getDate().toString().padStart(2, "0")}</Text>
                <Text style={styles.item}>{months[startTime.getMonth() - 1]}</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    flexGrow: 5,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <Text style={styles.item}>{item.title}</Text>
                    <Text style={styles.item}>{duration}</Text>
                </View>
                <View>
                    {
                        item.exercises.map((exercise, index) => {
                            return (
                                <Text
                                    key={index}
                                    style={styles.item}
                                >
                                    { exercise.sets.length }x {exercise.exercise?.name}
                                </Text>
                            )
                        })
                    }
                </View>
            </View>
        </Pressable>
    );
}

export default function Index() {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [logs, setLogs] = useState<Array<schema.LogsTableSelectType>>([]);
    const router = useRouter();

    console.log(useSQLiteContext());
    useDrizzleStudio(useSQLiteContext());

    async function handleCreateWorkout() {
        const newLog = await logDB
            .insert(schema.LogsTable)
            .values({
                title: "New Workout",
                startTime: new Date().getTime(),
            }).returning();

        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: newLog[0].id,
            },
        });
    }

    useEffect(() => {
        (async () => {
            const logs = await logDB
                .query.LogsTable.findMany({
                    with: {
                        exercises: {
                            with: {
                                exercise: true,
                                sets: true,
                            }
                        }
                    }
                });
            setLogs(logs);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={logs}
                renderItem={({item}) => (
                    <Workout {...item} />
                )}
            />
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
                onPress={handleCreateWorkout}
            >
                <Ionicons name="add-outline" size={32} />
            </Pressable>
        </View>
    );
}
