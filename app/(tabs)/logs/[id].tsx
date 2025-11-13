import ThemedCard from "@/components/themed-card";
import ThemedText from "@/components/themed-text";
import ThemedTextInput from "@/components/themed-text-input";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from "react";
import { GestureResponderEvent, Pressable, ScrollView, View } from "react-native";
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
        <ThemedView
            style={{
                flex: 1,
                flexDirection: "row",
            }}
        >
            <ThemedTextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    margin: 1,
                }}
                value={weight}
                onChangeText={(weight) => {
                    setWeight(weight);
                    handleOnUpdate({newWeight: weight});
                }}
            />
            <ThemedTextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    margin: 1,
                }}
                value={reps}
                onChangeText={(reps) => {
                    setReps(reps);
                    handleOnUpdate({newReps: reps});
                }}
            />
            <ThemedTextInput
                style={{
                    ...styles.input,
                    flexGrow: 1,
                    flexBasis: 0,
                    margin: 1,
                }}
                value={notes ?? ""}
                multiline
                onChangeText={(notes) => {
                    setNotes(notes);
                    handleOnUpdate({newNotes: notes});
                }}
            />
        </ThemedView>
    );
}

function Exercise(exercise: schema.LogExercisesTableSelectType) {
    return (
        <ThemedCard>
            <ThemedText style={{marginBottom: 10}}>
                {exercise.exercise.name}
            </ThemedText>
            {
                exercise.sets.map((set) => (
                    <Set key={set.id} {...set} />
                ))
            }
        </ThemedCard>
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
        <ThemedView
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
            }}
        >
            <ThemedText>
                <Ionicons
                    name="arrow-back-outline"
                    size={32}
                    onPress={handleBack}
                />
            </ThemedText>
            <ThemedText style={{...styles.title}}>Workout</ThemedText>
            <ThemedText>
                <Ionicons
                    name="trash-outline"
                    size={32}
                    onPress={props.onPress}
                />
            </ThemedText>
        </ThemedView>
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
        <SafeAreaView style={{flex: 1}}>
            <ThemedView
                style={{
                    flex: 1,
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
                        <ThemedCard>
                            <ThemedTextInput
                                style={{
                                    ...styles.input,
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
                                }}
                            >
                                <Pressable
                                    style={{flexGrow: 1}}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <ThemedTextInput style={{...styles.input}} editable={false}>
                                        {startTime.toLocaleDateString()}
                                    </ThemedTextInput>
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
                                    style={{flexGrow: 1}}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <ThemedTextInput style={{...styles.input}} editable={false}>
                                        {startTime.toLocaleTimeString()}
                                    </ThemedTextInput>
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
                                    style={{flexGrow: 1}}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <ThemedTextInput style={{...styles.input}} editable={false}>
                                        {endTime?.toLocaleTimeString()}
                                    </ThemedTextInput>
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
                            <ThemedTextInput
                                style={{
                                    ...styles.input,
                                    flexGrow: 1,
                                    verticalAlign: "top"
                                }}
                                value={notes}
                                multiline
                                placeholder="Notes"
                                onChangeText={(text) => {
                                    setNotes(text);
                                    handleOnUpdate({newNotes: text});
                                }}
                            />
                        </ThemedCard>
                        <View>
                            {
                                exercises.map((exercise, index) => (
                                    <Exercise key={index} {...exercise} />
                                ))
                            }
                        </View>
                    </View>
                </ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}
