import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import { GestureResponderEvent, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Set(set: schema.LogExerciseSetsTableSelectType) {
    const [weight, setWeight] = useState(set.weight?.toString());
    const [reps, setReps] = useState(set.reps?.toString());
    const [notes, setNotes] = useState(set.notes);

    const logDB = drizzle(useSQLiteContext(), { schema });
    type UpdateProps = {
        newWeight?: string,
        newReps?: string,
        newNotes?: string
    }
    async function handleOnUpdate(props: UpdateProps) {
        await logDB
            .update(schema.LogExerciseSetsTable)
            .set({
                weight: Number(props.newWeight ?? weight),
                reps: Number(props.newReps ?? reps),
                notes: props.newNotes ?? notes,
            })
            .where(eq(schema.LogExerciseSetsTable.id, set.id))
    }

    return (
        <View
            key={set.id}
            style={{
                flex: 1,
                flexDirection: "row",
            }}
        >
            <TextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    borderWidth: 2,
                    borderColor: "red",
                }}
                value={weight}
                onChangeText={(weight) => {
                    setWeight(weight);
                    handleOnUpdate({newWeight: weight});
                }}
            />
            <TextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    borderWidth: 2,
                    borderColor: "red",
                }}
                value={reps}
                onChangeText={(reps) => {
                    setReps(reps);
                    handleOnUpdate({newReps: reps});
                }}
            />
            <TextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    borderWidth: 2,
                    borderColor: "red",
                }}
                value={notes ?? ""}
                multiline
                onChangeText={(notes) => {
                    setNotes(notes);
                    handleOnUpdate({newNotes: notes});
                }}
            />
        </View>
    );
}

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
                    <Set key={set.id} {...set} />
                ))
            }
        </View>
    );
}

export type WorkoutHeaderProps = {
    onPress: (event: GestureResponderEvent) => void,
}
function WorkoutHeader(props: WorkoutHeaderProps) {
    const router = useRouter();
    function handleBack() {
        router.back();
    }

    return (
        <View
            style={{
                ...styles.container,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
            }}
        >
            <Ionicons
                name="arrow-back-outline"
                size={32}
                style={{...styles.text}}
                onPress={handleBack}
            />
            <Text style={{...styles.title}}>Workout</Text>
            <Ionicons
                name="trash-sharp"
                size={32}
                style={{...styles.text}}
                onPress={props.onPress}
            />
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
                setNotes(log.notes ?? "");
                setExercises(log.exercises);

                if (log.endTime) {
                    setEndTime(new Date(log.endTime));
                }
            }
        })();
    }, []);

    type UpdateProps = {
        newTitle?: string,
        newStartTime?: Date,
        newEndTime?: Date,
        newNotes?: string
    }
    async function handleOnUpdate(updateProps: UpdateProps) {
        await logDB
            .update(schema.LogsTable)
            .set({
                title: updateProps.newTitle ?? title,
                startTime: (updateProps.newStartTime ?? startTime).getTime(),
                endTime: (updateProps.newEndTime ?? endTime)?.getTime(),
                notes: updateProps.newNotes ?? notes,
            })
            .where(eq(schema.LogsTable.id, +id));
    }

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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#25292e",
                padding: 10,
            }}
        >
            <ScrollView>
                <WorkoutHeader onPress={handleOnDelete} />
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
                        onChangeText={(text) => {
                            setTitle(text);
                            handleOnUpdate({newTitle: text});
                        }}
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
                                        setStartTime(selectDate);

                                        const newEndTime = endTime;
                                        if (newEndTime) {
                                            newEndTime.setFullYear(selectDate.getFullYear());
                                            newEndTime.setMonth(selectDate.getMonth());
                                            newEndTime.setDate(selectDate.getDate());
                                        }

                                        handleOnUpdate({
                                            newStartTime: selectDate,
                                            newEndTime: newEndTime,
                                        });
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
                                        setStartTime(selectDate);
                                        handleOnUpdate({newStartTime: selectDate});
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
                                        setEndTime(selectDate);
                                        handleOnUpdate({newEndTime: selectDate});
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
                        onChangeText={(text) => {
                            setNotes(text);
                            handleOnUpdate({newNotes: text});
                        }}
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
        </SafeAreaView>
    );
}
