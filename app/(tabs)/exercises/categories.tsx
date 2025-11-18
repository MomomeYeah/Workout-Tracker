import ThemedCard from "@/components/themed-card";
import ThemedInvisibleIcon from "@/components/themed-invisible-icon";
import ThemedText from "@/components/themed-text";
import ThemedTextInput from "@/components/themed-text-input";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Button, FlatList, GestureResponderEvent, Modal, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ExerciseCategory(exercise_category: schema.ExerciseCategoriesTableSelectType) {
    const logDB = drizzle(useSQLiteContext(), { schema });
    
    async function handleDeleteExerciseCategory() {
        await logDB
            .delete(schema.ExerciseCategoriesTable)
            .where(eq(schema.ExerciseCategoriesTable.id, exercise_category.id))
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
            <ThemedText>{exercise_category.name}</ThemedText>
            <ThemedText>
                <Ionicons name="trash-outline" size={24} onPress={handleDeleteExerciseCategory} />
            </ThemedText>
        </ThemedCard>
    )
}

type AddExerciseCategoriesModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    handleCreateExerciseCategory: (name: string) => Promise<void>,
}
function AddExerciseCategoriesModal(props: AddExerciseCategoriesModalProps) {
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
                            props.handleCreateExerciseCategory(name);
                            setName("");
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
    
    function handleOpenCreateExerciseCategory() {
        setModalVisible(true);
    }

    async function handleCreateExerciseCategory(name: string) {
        await logDB
            .insert(schema.ExerciseCategoriesTable)
            .values({
                name: name
            });

        setModalVisible(false);
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
                        <ExerciseCategory {...item} />
                    )}
                    keyExtractor={exercise => exercise.id.toString()}
                    ListHeaderComponent={
                        <ExerciseCategoriesHeader handleCreateExerciseCategory={handleOpenCreateExerciseCategory} />
                    }
                    stickyHeaderIndices={[0]}
                />
                <AddExerciseCategoriesModal visible={modalVisible} setVisible={setModalVisible} handleCreateExerciseCategory={handleCreateExerciseCategory} />
            </ThemedView>
        </SafeAreaView>
    )
}