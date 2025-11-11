import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#25292e",
    },
    text: {
        color: "#fff"
    },
    input: {
        color: "#fff",
        borderWidth: 1,
        borderColor: "#fff",
        padding: 10,
    },
});

function Exercise(exercise: schema.LogExercisesTableSelectType) {
    return (
        <View
            style={{
                ...styles.container,
                borderWidth: 1,
                borderColor: "#fff",
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
            }}
        >
            <Text style={{...styles.text}}>
                {exercise.exercise.name}
            </Text>
            {
                exercise.sets.map((set) => (
                    <View
                        key={set.id}
                        style={{
                            ...styles.container,
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <Text style={{...styles.text, flexGrow: 1}}>
                            {set.weight}
                        </Text>
                        <Text style={{...styles.text, flexGrow: 1}}>
                            {set.reps}
                        </Text>
                        <Text style={{...styles.text, flexGrow: 1}}>
                            {set.notes}
                        </Text>
                    </View>
                ))
            }
        </View>
    );
}

export default function Workout() {
    const { id } = useLocalSearchParams();
    const logDB = drizzle(useSQLiteContext(), { schema });

    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [notes, setNotes] = useState("");
    const [exercises, setExercises] = useState<Array<schema.LogExercisesTableSelectType>>([]);

    useEffect(() => {
        (async () => {
            const log = await logDB
                .query.LogsTable.findFirst({
                    where: eq(schema.LogsTable.id, +id),
                    with: {
                        exercises: {
                            with: {
                                exercise: true,
                                sets: true,
                            }
                        }
                    }
                });

            if (log) {
                setTitle(log.title);
                setStartTime(log.startTime.toString());
                setExercises(log.exercises);

                if (log.endTime) {
                    setEndTime(log.endTime.toString());
                }
            }
        })();
    }, []);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#25292e",
                padding: 10,
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                }}
            >
                <TextInput
                    style={{
                        ...styles.input,
                        flexGrow: 1,
                        borderWidth: 2,
                        borderColor: "red",
                    }}
                    value={title}
                    onChangeText={setTitle}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        flexGrow: 1,
                        borderWidth: 2,
                        borderColor: "green",
                    }}
                >
                    <TextInput
                        style={{
                            ...styles.input,
                            flexGrow: 1,
                        }}
                        value={startTime}
                        onChangeText={setStartTime}
                    />
                    <TextInput
                        style={{
                            ...styles.input,
                            flexGrow: 1,
                        }}
                        value={endTime}
                        onChangeText={setEndTime}
                    />
                </View>
                <TextInput
                    style={{
                        ...styles.input,
                        flexGrow: 1,
                        verticalAlign: "top"
                    }}
                    value={notes}
                    placeholder="Notes"
                    placeholderTextColor="#fff"
                    onChangeText={setNotes}
                />
                <View
                    style={{
                        flexGrow: 3,
                    }}
                >
                    <Text style={{
                        ...styles.text,
                        fontSize: 24,
                    }}>
                        Exercises
                    </Text>
                    {
                        exercises.map((exercise, index) => (
                            <Exercise key={index} {...exercise} />
                        ))
                    }
                </View>
            </View>
        </ScrollView>
    );
}
