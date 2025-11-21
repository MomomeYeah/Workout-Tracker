import ThemedCard from "@/components/themed-card";
import ThemedDropdown from "@/components/themed-dropdown";
import ThemedInvisibleIcon from "@/components/themed-invisible-icon";
import ThemedText from "@/components/themed-text";
import ThemedTextInput from "@/components/themed-text-input";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { eq, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { Button, FlatList, GestureResponderEvent, Modal, Pressable, TextInput } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";

type ExerciseContextProps = {
    exercise: schema.ExercisesTableSelectType | null
}
const ExerciseContext = createContext({} as ExerciseContextProps);

type ExerciseProps = {
    exercise: schema.ExercisesTableSelectType,
    handleEditExercise: (context: schema.ExercisesTableSelectType | null) => void
}
function Exercise(props: ExerciseProps) {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [contextMenuOpened, setContextMenuOpened] = useState(false);
    const theme = useTheme();

    async function handleDeleteExercise() {
        await logDB
            .delete(schema.ExercisesTable)
            .where(eq(schema.ExercisesTable.id, props.exercise.id))
    }

    return (
        <ThemedCard
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Pressable
                style={{flexGrow: 1}}
                onPress={() => {
                    setContextMenuOpened(false);
                    props.handleEditExercise(props.exercise);
                }}
            >
                <ThemedText>
                    {props.exercise.name} ({props.exercise.exercise_category?.name}) ({props.exercise.single_limb ? "Single Limb" : "Not Single Limb"})
                </ThemedText>
            </Pressable>
            <Menu
                opened={contextMenuOpened}
                onBackdropPress={() => setContextMenuOpened(false)}
            >
                <MenuTrigger onPress={() => setContextMenuOpened(true)}>
                    <ThemedText>
                        <Ionicons name="ellipsis-vertical-sharp" size={24} />
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
                        <Pressable
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                            onPress={() => {
                                setContextMenuOpened(false);
                                props.handleEditExercise(props.exercise);
                            }}
                        >
                            <ThemedText style={{paddingRight: 10}}>
                                <Ionicons name="pencil-outline" size={24} color={theme.colors.text} />
                            </ThemedText>
                            <ThemedText style={{color: theme.colors.text}}>Edit</ThemedText>
                        </Pressable>
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
                                handleDeleteExercise();
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
        </ThemedCard>
    );
}

type AddExerciseModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    handleSaveExercise: (name: string, exercise_category_id: number, single_limb: boolean) => Promise<void>,
}
function AddExerciseModal(props: AddExerciseModalProps) {
    const context = useContext(ExerciseContext);
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [name, setName] = useState(context.exercise?.name);
    const [exerciseCategory, setExerciseCategory] = useState(context.exercise?.exercise_category_id);
    const [isExerciseCategoryFocus, setIsExerciseCategoryFocus] = useState(false);
    const [exerciseCategories, setExerciseCategories] = useState<Array<schema.ExerciseCategoriesTableSelectType>>([]);
    const [singleLimb, setSingleLimb] = useState(context.exercise?.single_limb);
    const [isSingleLimbFocus, setIsSingleLimbFocus] = useState(false);
    const nameRef = useRef<TextInput>(null);
    const theme = useTheme();

    useEffect(() => {
        (async () => {
            const exercise_categories = await logDB
                .query.ExerciseCategoriesTable.findMany();

            setExerciseCategories(exercise_categories);
        })();
    }, []);
    
    useEffect(() => {
        setName(context.exercise?.name);
        setExerciseCategory(context.exercise?.exercise_category_id);
        setSingleLimb(context.exercise?.single_limb);
    }, [context.exercise]);

    function clearFields() {
        setName("");
        setExerciseCategory(undefined);
        setSingleLimb(undefined);
    }

    return (
        <Modal
            animationType="slide"
            visible={props.visible}
            onRequestClose={() => {
                clearFields();
                props.setVisible(false);
            }}
            transparent={true}
            // keyboard, mysteriously, will not open without a short timeout here
            onShow={() => setTimeout(() => nameRef.current?.focus(), 100)}
        >
            <SafeAreaView style={{flex: 1}}>
                <ThemedView
                    style={{
                        flex: 1,
                        padding: 30,
                        paddingTop: 30
                    }}
                >
                    <ThemedText style={{...styles.h1, marginBottom: 20}}>Add Exercise</ThemedText>
                    <ThemedTextInput
                        ref={nameRef}
                        containerStyle={{marginBottom: 10}}
                        value={name}
                        label="Exercise Name"
                        placeholder="Exercise name"
                        onChangeText={(text) => setName(text)}
                    />
                    <ThemedDropdown
                        style={{marginBottom: 10}}
                        data={exerciseCategories}
                        labelField="name"
                        valueField="id"
                        placeholder={! isExerciseCategoryFocus ? 'Select exercise category' : '...'}
                        value={exerciseCategory}
                        label="Exercise Category"
                        onFocus={() => setIsExerciseCategoryFocus(true)}
                        onBlur={() => setIsExerciseCategoryFocus(false)}
                        onChange={item => {
                            setExerciseCategory(item.id);
                            setIsExerciseCategoryFocus(false);
                        }}
                    />
                    <ThemedDropdown
                        style={{marginBottom: 10}}
                        data={[
                            {"label": "Yes", "value": true},
                            {"label": "No", "value": false},

                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder={! isSingleLimbFocus ? 'Single limb?' : '...'}
                        value={singleLimb}
                        label="Single Limb?"
                        onFocus={() => setIsSingleLimbFocus(true)}
                        onBlur={() => setIsSingleLimbFocus(false)}
                        onChange={item => {
                            setSingleLimb(item.value);
                            setIsSingleLimbFocus(false);
                        }}
                    />
                    <Button title="Save" onPress={() => {
                        if (name && exerciseCategory && singleLimb !== undefined) {
                            clearFields();
                            props.handleSaveExercise(name, exerciseCategory, singleLimb);
                        }
                    }} />
                </ThemedView>
            </SafeAreaView>
        </Modal>
    )
}

export type ExercisesHeaderProps = {
    handleCreateExercise: (event: GestureResponderEvent) => void,
    handleEditCategories: (event: GestureResponderEvent) => void,
}
function ExercisesHeader(props: ExercisesHeaderProps) {
    const [contextMenuOpened, setContextMenuOpened] = useState(false);
    const theme = useTheme();
    
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
            <ThemedInvisibleIcon />
            <ThemedText style={{...styles.h1}}>Exercises</ThemedText>
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
                                props.handleCreateExercise(e);
                            }}
                        >
                            <ThemedText style={{paddingRight: 10}}>
                                <Ionicons name="add-outline" size={24} color={theme.colors.text} />
                            </ThemedText>
                            <ThemedText style={{color: theme.colors.text}}>Add Exercise</ThemedText>
                        </Pressable>
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
                                props.handleEditCategories(e);
                            }}
                        >
                            <ThemedText style={{paddingRight: 10}}>
                                <Ionicons name="grid-outline" size={24} color={theme.colors.text} />
                            </ThemedText>
                            <ThemedText style={{color: theme.colors.text}}>Edit Categories</ThemedText>
                        </Pressable>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </ThemedView>
    );
}

export default function ExercisesScreen() {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editModalContext, setEditModalContext] = useState<schema.ExercisesTableSelectType | null>(null);

    function handleOpenCreateExercise(context: schema.ExercisesTableSelectType | null) {
        setEditModalVisible(true);
        setEditModalContext(context);
    }

    async function handleSaveExercise(name: string, exercise_category_id: number, single_limb: boolean) {
        if (editModalContext) {
            await logDB
                .update(schema.ExercisesTable)
                .set({
                    name: name,
                    exercise_category_id: exercise_category_id,
                    single_limb: single_limb,
                })
                .where(eq(schema.ExercisesTable.id, editModalContext.id));
        } else {
            await logDB
                .insert(schema.ExercisesTable)
                .values({
                    name: name,
                    exercise_category_id: exercise_category_id,
                    single_limb: single_limb,
                });
        }

        setEditModalVisible(false);
        setEditModalContext(null);
    }

    const router = useRouter();
    function handleEditCategories() {
        router.navigate({
            pathname: "/(tabs)/exercises/categories",
        });
    }

    const { data: exercises, error, updatedAt } = useLiveQuery(
        logDB.query.ExercisesTable.findMany({
            with: {
                exercise_category: true
            },
            orderBy: sql`lower(${schema.ExercisesTable.name})`
        })
    );

    return (
        <SafeAreaView
            style={{
                    flex: 1,
                    padding: 10,
                    paddingBottom: 0,
                }}
            edges={['right', 'left', 'top']}
        >
            <FlatList
                data={exercises}
                renderItem={({item}) => (
                    <Exercise exercise={item} handleEditExercise={handleOpenCreateExercise} />
                )}
                keyExtractor={exercise => exercise.id.toString()}
                ListHeaderComponent={
                    <ExercisesHeader
                        handleCreateExercise={() => handleOpenCreateExercise(null)}
                        handleEditCategories={handleEditCategories} />
                }
                stickyHeaderIndices={[0]}
            />
            <ExerciseContext.Provider value={{exercise: editModalContext}}>
                <AddExerciseModal visible={editModalVisible} setVisible={setEditModalVisible} handleSaveExercise={handleSaveExercise} />
            </ExerciseContext.Provider>
        </SafeAreaView>
    );
}
