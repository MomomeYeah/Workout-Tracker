import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import DateTimePicker from '@react-native-community/datetimepicker';
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import { Button, Pressable, ScrollView, Text, TextInput, View } from "react-native";

function Exercise(exercise: schema.LogExercisesTableSelectType) {
    return (
        <View
            style={{
                ...styles.card
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

    const [startTime, setStartTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    
    const [endTime, setEndTime] = useState<Date | undefined>(undefined);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    
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
                setStartTime(new Date(log.startTime));
                setExercises(log.exercises);

                if (log.endTime) {
                    setEndTime(new Date(log.endTime));
                }
            }
        })();
    }, []);

    const router = useRouter();
    async function handleOnDelete() {
        await logDB
            .delete(schema.LogsTable)
            .where(eq(schema.LogsTable.id, +id));

        router.navigate({
            pathname: "/(tabs)/logs",
        });
    }

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
                    <Pressable
                        style={{
                            flexGrow: 1,
                            borderWidth: 1,
                            borderColor: "pink",
                        }}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <TextInput
                            style={{...styles.text}}
                            editable={false}
                        >
                            {startTime.toLocaleDateString()}
                        </TextInput>
                    </Pressable>
                    {
                        showDatePicker &&
                        <DateTimePicker
                            value={new Date(startTime)}
                            mode="date"
                            onChange={(event, selectDate) => {
                                setShowDatePicker(false);
                                if (selectDate) {
                                    setStartTime(selectDate)
                                }
                            }}
                        />
                    }
                    <Pressable
                        style={{
                            flexGrow: 1,
                            borderWidth: 1,
                            borderColor: "pink",
                        }}
                        onPress={() => setShowStartTimePicker(true)}
                    >
                        <TextInput
                            style={{...styles.text}}
                            editable={false}
                        >
                            {startTime.toLocaleTimeString()}
                        </TextInput>
                    </Pressable>
                    {
                        showStartTimePicker &&
                        <DateTimePicker
                            value={new Date(startTime)}
                            mode="time"
                            onChange={(event, selectDate) => {
                                setShowStartTimePicker(false);
                                if (selectDate) {
                                    setStartTime(selectDate)
                                }
                            }}
                        />
                    }
                    <Pressable
                        style={{
                            flexGrow: 1,
                            borderWidth: 1,
                            borderColor: "pink",
                        }}
                        onPress={() => setShowEndTimePicker(true)}
                    >
                        <TextInput
                            style={{...styles.text}}
                            editable={false}
                        >
                            {endTime?.toLocaleTimeString()}
                        </TextInput>
                    </Pressable>
                    {
                        showEndTimePicker &&
                        <DateTimePicker
                            value={endTime ? new Date(endTime) : new Date()}
                            mode="time"
                            onChange={(event, selectDate) => {
                                setShowEndTimePicker(false);
                                if (selectDate) {
                                    setEndTime(selectDate)
                                }
                            }}
                        />
                    }
                </View>
                <TextInput
                    style={{
                        ...styles.input,
                        flexGrow: 1,
                        verticalAlign: "top"
                    }}
                    value={notes}
                    multiline
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
            <Button title="Delete" onPress={handleOnDelete} />
        </ScrollView>
    );
}
