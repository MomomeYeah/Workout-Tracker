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
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button, FlatList, GestureResponderEvent, Modal, Pressable, TextInput } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";

function Exercise(exercise: schema.ExercisesTableSelectType) {
    const logDB = drizzle(useSQLiteContext(), { schema });

    async function handleDeleteExercise() {
        await logDB
            .delete(schema.ExercisesTable)
            .where(eq(schema.ExercisesTable.id, exercise.id))
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
            <ThemedText>
                {exercise.name}
            </ThemedText>
            <ThemedText>
                <Ionicons name="trash-outline" size={24} onPress={handleDeleteExercise} />
            </ThemedText>
        </ThemedCard>
    );
}

type AddExerciseModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    handleCreateExercise: (name: string) => Promise<void>,
}
function AddExerciseModal(props: AddExerciseModalProps) {
    const [name, setName] = useState("");
    const nameRef = useRef<TextInput>(null);

    return (
        <Modal
            animationType="slide"
            visible={props.visible}
            onRequestClose={() => {
                props.setVisible(false);
                setName("");
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
                    <ThemedText style={{...styles.h1, marginBottom: 20}}>Add Exercise</ThemedText>
                    <ThemedTextInput
                        ref={nameRef}
                        style={{marginBottom: 10}}
                        value={name}
                        placeholder="Exercise name"
                        onChangeText={(text) => setName(text)}
                    />
                    <Button title="Save" onPress={() => {
                        if (name) {
                            props.handleCreateExercise(name);
                            setName("");
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
    const [modalVisible, setModalVisible] = useState(false);

    function handleOpenCreateExercise() {
        setModalVisible(true);
    }

    async function handleCreateExercise(name: string) {
        await logDB
            .insert(schema.ExercisesTable)
            .values({
                name: name
            });

        setModalVisible(false);
    }

    const router = useRouter();
    function handleEditCategories() {
        router.navigate({
            pathname: "/(tabs)/exercises/categories",
        });
    }

    const { data: exercises, error, updatedAt } = useLiveQuery(
        logDB
            .select()
            .from(schema.ExercisesTable)
            .orderBy(sql`lower(${schema.ExercisesTable.name})`)
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
                    data={exercises}
                    renderItem={({item}) => (
                        <Exercise {...item} />
                    )}
                    keyExtractor={exercise => exercise.id.toString()}
                    ListHeaderComponent={
                        <ExercisesHeader
                            handleCreateExercise={handleOpenCreateExercise}
                            handleEditCategories={handleEditCategories} />
                    }
                    stickyHeaderIndices={[0]}
                />
                <AddExerciseModal visible={modalVisible} setVisible={setModalVisible} handleCreateExercise={handleCreateExercise} />
            </ThemedView>
        </SafeAreaView>
    );
}
