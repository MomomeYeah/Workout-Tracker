import AddItemButton from "@/components/add-item-button";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { Dispatch, SetStateAction, useState } from "react";
import { Button, FlatList, Modal, Text, TextInput, View } from "react-native";

function Exercise(exercise: schema.ExercisesTableSelectType) {
    const logDB = drizzle(useSQLiteContext(), { schema });

    async function handleDeleteExercise() {
        await logDB
            .delete(schema.ExercisesTable)
            .where(eq(schema.ExercisesTable.id, exercise.id))
    }

    return (
        <View
            style={{
                ...styles.card,
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Text style={styles.text}>
                {exercise.name}
            </Text>
            <Ionicons style={styles.text} name="trash-sharp" size={24} onPress={handleDeleteExercise} />
        </View>
    );
}

type AddExerciseModalProps = {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>
    handleCreateExercise: (name: string) => Promise<void>,
}
function AddExerciseModal(props: AddExerciseModalProps) {
    const [name, setName] = useState("");

    return (
        <Modal
            animationType="slide"
            visible={props.visible}
            onRequestClose={() => {
                props.setVisible(false);
                setName("");
            }}
        >
            <View
                style={{
                    ...styles.container,
                    flex: 1,
                }}
            >
                <TextInput style={{...styles.input}} value={name} onChangeText={(text) => setName(text)} />
                <Button title="Save" onPress={() => {
                    if (name) {
                        props.handleCreateExercise(name);
                        setName("");
                    }
                }} />
            </View>
        </Modal>
    )
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

    const { data: exercises, error, updatedAt } = useLiveQuery(
        logDB
            .select()
            .from(schema.ExercisesTable)
            .orderBy(sql`lower(${schema.ExercisesTable.name})`)
    );

    return (
        <View
            style={{
                ...styles.container,
                flex: 1,
                padding: 5,
            }}
        >
            <FlatList
                data={exercises}
                renderItem={({item}) => (
                    <Exercise {...item} />
                )}
                keyExtractor={exercise => exercise.id.toString()}
            />
            <AddItemButton onPress={handleOpenCreateExercise} />
            <AddExerciseModal visible={modalVisible} setVisible={setModalVisible} handleCreateExercise={handleCreateExercise} />
        </View>
    );
}
