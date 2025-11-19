import ThemedCard from "@/components/themed-card";
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
import { useSQLiteContext } from "expo-sqlite";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { Button, FlatList, GestureResponderEvent, Modal, Pressable, TextInput } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";

type ExerciseCategoryContextProps = {
    exercise_category: schema.ExerciseCategoriesTableSelectType | null
}
const ExerciseCategoryContext = createContext({} as ExerciseCategoryContextProps);

type ExerciseCategoryProps = {
    exercise_category: schema.ExerciseCategoriesTableSelectType,
    handleEditExerciseCategory: (context: schema.ExerciseCategoriesTableSelectType | null) => void
}
function ExerciseCategory(props: ExerciseCategoryProps) {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [contextMenuOpened, setContextMenuOpened] = useState(false);
    const theme = useTheme();
    
    async function handleDeleteExerciseCategory() {
        await logDB
            .delete(schema.ExerciseCategoriesTable)
            .where(eq(schema.ExerciseCategoriesTable.id, props.exercise_category.id))
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
                    props.handleEditExerciseCategory(props.exercise_category);
                }}
            >
                <ThemedText>{props.exercise_category.name}</ThemedText>
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
                                props.handleEditExerciseCategory(props.exercise_category);
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
                                handleDeleteExerciseCategory();
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
    )
}

type AddExerciseCategoriesModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    handleSaveExerciseCategory: (name: string) => Promise<void>,
}
function AddExerciseCategoriesModal(props: AddExerciseCategoriesModalProps) {
    const context = useContext(ExerciseCategoryContext);
    const [name, setName] = useState(context.exercise_category?.name);
    const nameRef = useRef<TextInput>(null);
        
    useEffect(() => {
        setName(context.exercise_category?.name);
    }, [context.exercise_category]);

    return (
        <Modal
            animationType="slide"
            visible={props.visible}
            onRequestClose={() => {
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
                    }}
                >
                    <ThemedText style={{...styles.h1, marginBottom: 20}}>Add Exercise Category</ThemedText>
                    <ThemedTextInput
                        ref={nameRef}
                        style={{marginBottom: 10}}
                        value={name}
                        placeholder="Exercise category name"
                        onChangeText={(text) => setName(text)}
                    />
                    <Button title="Save" onPress={() => {
                        if (name) {
                            props.handleSaveExerciseCategory(name);
                        }
                    }} />
                </ThemedView>
            </SafeAreaView>
        </Modal>
    )
}

export type ExercisesHeaderProps = {
    handleCreateExerciseCategory: (event: GestureResponderEvent) => void,
}
function ExerciseCategoriesHeader(props: ExercisesHeaderProps) {
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
            <ThemedText style={{...styles.h1}}>Exercise Categories</ThemedText>
            <ThemedText>
                <Ionicons
                    name="add-outline"
                    size={32}
                    onPress={props.handleCreateExerciseCategory}
                />
            </ThemedText>
        </ThemedView>
    );
}

export default function CategoriesScreen() {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalContext, setEditModalContext] = useState<schema.ExerciseCategoriesTableSelectType | null>(null);
    
    function handleOpenCreateExerciseCategory(context: schema.ExerciseCategoriesTableSelectType | null) {
        setModalVisible(true);
        setEditModalContext(context);
    }

    async function handleSaveExerciseCategory(name: string) {
        if (editModalContext) {
            await logDB
                .update(schema.ExerciseCategoriesTable)
                .set({
                    name: name
                })
                .where(eq(schema.ExerciseCategoriesTable.id, editModalContext.id));
        } else {
            await logDB
                .insert(schema.ExerciseCategoriesTable)
                .values({
                    name: name
                });
        }

        setModalVisible(false);
        setEditModalContext(null);
    }

    const { data: categories, error, updatedAt } = useLiveQuery(
        logDB
            .select()
            .from(schema.ExerciseCategoriesTable)
            .orderBy(sql`lower(${schema.ExerciseCategoriesTable.name})`)
    );

    return (
        <SafeAreaView
            style={{
                    flex: 1,
                    padding: 10,
                }}
        >
            <ThemedView style={{flex: 1}}>
                <FlatList
                    data={categories}
                    renderItem={({item}) => (
                        <ExerciseCategory exercise_category={item} handleEditExerciseCategory={handleOpenCreateExerciseCategory} />
                    )}
                    keyExtractor={exercise => exercise.id.toString()}
                    ListHeaderComponent={
                        <ExerciseCategoriesHeader handleCreateExerciseCategory={() => handleOpenCreateExerciseCategory(null)} />
                    }
                    stickyHeaderIndices={[0]}
                />
                <ExerciseCategoryContext.Provider value={{exercise_category: editModalContext}}>
                    <AddExerciseCategoriesModal visible={modalVisible} setVisible={setModalVisible} handleSaveExerciseCategory={handleSaveExerciseCategory} />
                </ExerciseCategoryContext.Provider>
            </ThemedView>
        </SafeAreaView>
    )
}