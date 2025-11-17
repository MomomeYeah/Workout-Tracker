import ThemedCard from "@/components/themed-card";
import ThemedText from "@/components/themed-text";
import ThemedTextInput from "@/components/themed-text-input";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "@react-navigation/native";
import { and, count, eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, GestureResponderEvent, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "react-native-segmented-control-2";

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

    async function handleDeleteSet() {
        // delete this set
        await logDB
            .delete(schema.LogExerciseSetsTable)
            .where(eq(schema.LogExerciseSetsTable.id, set.id));

        // if associated exercise has no remaining sets, delete it as well
        const remainingSets = await logDB
            .select({count: count()})
            .from(schema.LogExerciseSetsTable)
            .where(eq(schema.LogExerciseSetsTable.log_exercise_id, set.log_exercise_id));

        if (remainingSets[0].count === 0) {
            await logDB
                .delete(schema.LogExercisesTable)
                .where(eq(schema.LogExercisesTable.id, set.log_exercise_id));
        }
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <ThemedTextInput
                style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    margin: 1,
                }}
                keyboardType="numeric"
                value={weight}
                onChangeText={(weight) => {
                    setWeight(weight);
                    handleOnUpdate({newWeight: weight});
                }}
            />
            <ThemedTextInput
                style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    margin: 1,
                }}
                keyboardType="numeric"
                value={reps}
                onChangeText={(reps) => {
                    setReps(reps);
                    handleOnUpdate({newReps: reps});
                }}
            />
            <ThemedTextInput
                style={{
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
            <ThemedText>
                <Ionicons
                    name="trash-outline"
                    size={24}
                    onPress={handleDeleteSet}
                />
            </ThemedText>
        </View>
    );
}

function Exercise({log_exercise_id}: {log_exercise_id: number}) {
    const logDB = drizzle(useSQLiteContext(), { schema });

    const { data: exercise } = useLiveQuery(
        logDB.query.LogExercisesTable.findFirst({
            where: eq(schema.LogExercisesTable.id, log_exercise_id),
            with: {
                exercise: true
            }
        })
    );

    const { data: sets } = useLiveQuery(
        logDB.query.LogExerciseSetsTable.findMany({
            where: eq(schema.LogExerciseSetsTable.log_exercise_id, log_exercise_id)
        })
    );

    async function handleDeleteExercise() {
        await logDB
            .delete(schema.LogExercisesTable)
            .where(eq(schema.LogExercisesTable.id, log_exercise_id));
    }

    async function handleCreateSet() {
        await logDB
            .insert(schema.LogExerciseSetsTable)
            .values({
                log_exercise_id: log_exercise_id
            });
    }

    return (
        <ThemedCard>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10
                }}
            >
                <ThemedText style={{...styles.h2}}>
                    {exercise?.exercise.name}
                </ThemedText>
                <ThemedText>
                    <Ionicons
                        name="trash-outline"
                        size={24}
                        onPress={handleDeleteExercise}
                    />
                </ThemedText>
            </View>
            <View style={{marginBottom: 10}}>
                {
                    sets.map((set) => (
                        <Set key={set.id} {...set} />
                    ))
                }
            </View>
            <Button title="Add Set" onPress={handleCreateSet} />
        </ThemedCard>
    );
}

type AddExerciseModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    handleAddExercise: (id: number) => Promise<void>,
}
function AddExerciseModal(props: AddExerciseModalProps) {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const { data: exercises, error, updatedAt } = useLiveQuery(
        logDB.query.ExercisesTable.findMany({
            orderBy: schema.ExercisesTable.name
        })
    );

    return (
        <Modal
            animationType="slide"
            visible={props.visible}
            onRequestClose={() => {
                props.setVisible(false);
            }}
            transparent={false}
        >
            <ThemedView
                style={{
                    flex: 1,
                    padding: 30,
                }}
            >
                <ThemedText style={{...styles.h1, marginBottom: 20}}>Add Exercise</ThemedText>
                {
                    exercises.map((exercise) => (
                        <Pressable
                            key={exercise.id}
                            style={{flex: 1}}
                            onPress={() => props.handleAddExercise(exercise.id)}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <ThemedText style={{}}>{exercise.name}</ThemedText>
                                <ThemedText>
                                    <Ionicons
                                        name="add-outline"
                                        size={24}
                                    />
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))
                }
            </ThemedView>
        </Modal>
    )
}

export type WorkoutHeaderProps = {
    handleDeleteWorkout: (event: GestureResponderEvent) => void,
    workoutType: schema.WorkoutTypeKeys | undefined,
    setWorkoutType: (workoutType: schema.WorkoutTypeKeys) => void,
}
function WorkoutHeader(props: WorkoutHeaderProps) {
    const [contextMenuOpened, setContextMenuOpened] = useState(false);
    const theme = useTheme();

    const router = useRouter();
    function handleBack() {
        router.back();
    }

    console.log(theme.colors)

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
            <ThemedText style={{...styles.h1}}>
                Workout
                { props.workoutType === "Deload" ? " (Deload)" : ""}
            </ThemedText>
            <Menu
                opened={contextMenuOpened}
                onBackdropPress={() => setContextMenuOpened(false)}
            >
                <MenuTrigger onPress={() => setContextMenuOpened(true)}>
                    <ThemedText>
                        <Ionicons name="ellipsis-vertical-sharp" size={32} />
                    </ThemedText>
                </MenuTrigger>
                <MenuOptions
                    customStyles={{
                        optionsContainer: {
                            backgroundColor: theme.colors.card,
                            borderWidth: 1,
                            borderColor: theme.colors.text,
                            width: "75%",
                            padding: 5,
                        }
                    }}
                >
                    <MenuOption>
                        <ThemedText style={{marginLeft: 5, marginTop: 5, color: theme.colors.text}}>Workout Type</ThemedText>
                    </MenuOption>
                    <MenuOption>
                        <SegmentedControl
                            style={{height: 40, width: "100%"}}
                            tabs={[...schema.WorkoutType]}
                            initialIndex={props.workoutType ? schema.WorkoutType.indexOf(props.workoutType) : 0}
                            onChange={(index) => {
                                const newWorkoutType = schema.WorkoutType[index];
                                props.setWorkoutType(newWorkoutType);
                            }}
                        />
                    </MenuOption>
                    <MenuOption>
                        <Pressable
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                            onPress={(e) => {
                                setContextMenuOpened(false);
                                props.handleDeleteWorkout(e);
                            }}
                        >
                            <ThemedText style={{paddingRight: 10}}>
                                <Ionicons name="trash-outline" size={24} color={"red"} />
                            </ThemedText>
                            <ThemedText style={{color: "red"}}>Delete</ThemedText>
                        </Pressable>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </ThemedView>
    );
}

export default function Workout() {
    const { id } = useLocalSearchParams();
    const logDB = drizzle(useSQLiteContext(), { schema });

    const [workoutType, setWorkoutType] = useState<schema.WorkoutTypeKeys | undefined>(undefined);
    const [title, setTitle] = useState("");
    const [bodyWeight, setBodyWeight] = useState("");

    const [startTime, setStartTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    
    const [endTime, setEndTime] = useState<Date | undefined>(undefined);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    
    const [notes, setNotes] = useState("");

    useEffect(() => {
        (async () => {
            const log = await logDB
                .query.LogsTable.findFirst({
                    where: eq(schema.LogsTable.id, +id),
                });

            if (log) {
                setWorkoutType(log.workout_type);
                setTitle(log.title);
                setBodyWeight(log.bodyWeight?.toString() ?? "");
                setStartTime(new Date(log.startTime));
                setNotes(log.notes ?? "");

                if (log.endTime) {
                    setEndTime(new Date(log.endTime));
                }
            }
        })();
    }, []);

    const { data: log_exercises, error, updatedAt } = useLiveQuery(
        logDB.query.LogExercisesTable.findMany({
            where: eq(schema.LogExercisesTable.log_id, +id),
            with: {
                exercise: true,
            }
        })
    );
    
    const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);
    function handleOpenAddExerciseModal() {
        setAddExerciseModalVisible(true);
    }
    async function handleAddExercise(exercise_id: number) {
        const existingRelation = await logDB
            .select()
            .from(schema.LogExercisesTable)
            .where(
                and(
                    eq(schema.LogExercisesTable.exercise_id, exercise_id),
                    eq(schema.LogExercisesTable.log_id, +id)
                )
            );

        // if the selected exercise already exists on this workout, do nothing
        if (existingRelation.length === 0) {
            const log_exercise = await logDB
                .insert(schema.LogExercisesTable)
                .values({
                    log_id: +id,
                    exercise_id: exercise_id
                })
                .returning();

            // add an initial set for new exercises
            await logDB
                .insert(schema.LogExerciseSetsTable)
                .values({
                    log_exercise_id: log_exercise[0].id
                });
        }

        setAddExerciseModalVisible(false);
    }

    type UpdateProps = {
        newWorkoutType?: schema.WorkoutTypeKeys,
        newTitle?: string,
        newBodyWeight?: string,
        newStartTime?: Date,
        newEndTime?: Date,
        newNotes?: string
    }
    async function handleOnUpdate(updateProps: UpdateProps) {
        await logDB
            .update(schema.LogsTable)
            .set({
                workout_type: updateProps.newWorkoutType ?? workoutType,
                title: updateProps.newTitle ?? title,
                bodyWeight: Number(updateProps.newBodyWeight ?? bodyWeight),
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ThemedView
                    style={{
                        flex: 1,
                        padding: 10,
                    }}
                >
                    <ScrollView>
                        <WorkoutHeader
                            handleDeleteWorkout={handleOnDelete}
                            workoutType={workoutType}
                            setWorkoutType={(value) => {
                                setWorkoutType(value);
                                handleOnUpdate({newWorkoutType: value});
                            }}
                        />
                        {/* <SegmentedControl
                            values={[...schema.WorkoutType]}
                            selectedIndex={workoutType ? schema.WorkoutType.indexOf(workoutType) : 0}
                            onChange={(event) => {
                                const selectedIndex = event.nativeEvent.selectedSegmentIndex;
                                const newWorkoutType = schema.WorkoutType[selectedIndex];
                                // props.setWorkoutType(newWorkoutType);
                            }}
                        /> */}
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                            }}
                        >
                            <ThemedCard>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        flexGrow: 1,
                                    }}
                                >
                                    <ThemedTextInput
                                        style={{
                                            margin: 1,
                                            flexGrow: 2,
                                            flexBasis: 0,
                                        }}
                                        value={title}
                                        onChangeText={(text) => {
                                            setTitle(text);
                                            handleOnUpdate({newTitle: text});
                                        }}
                                    />
                                    <ThemedTextInput
                                        style={{
                                            margin: 1,
                                            flexGrow: 1,
                                            flexBasis: 0,
                                        }}
                                        keyboardType="numeric"
                                        value={bodyWeight}
                                        onChangeText={(bodyWeight) => {
                                            setBodyWeight(bodyWeight);
                                            handleOnUpdate({newBodyWeight: bodyWeight});
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        flexGrow: 1,
                                    }}
                                >
                                    <Pressable
                                        style={{flexGrow: 1, margin: 1}}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <ThemedTextInput editable={false}>
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
                                        style={{flexGrow: 1, margin: 1}}
                                        onPress={() => setShowStartTimePicker(true)}
                                    >
                                        <ThemedTextInput editable={false}>
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
                                        style={{flexGrow: 1, margin: 1}}
                                        onPress={() => setShowEndTimePicker(true)}
                                    >
                                        <ThemedTextInput editable={false}>
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
                                        flexGrow: 1,
                                        verticalAlign: "top",
                                        margin: 1
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
                                    log_exercises.map((log_exercise) => (
                                        <Exercise key={log_exercise.id} log_exercise_id={log_exercise.id} />
                                    ))
                                }
                            </View>
                            <Button title="Add Exercise" onPress={handleOpenAddExerciseModal} />
                            <AddExerciseModal
                                visible={addExerciseModalVisible}
                                setVisible={setAddExerciseModalVisible}
                                handleAddExercise={handleAddExercise}
                            />
                        </View>
                    </ScrollView>
                </ThemedView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
