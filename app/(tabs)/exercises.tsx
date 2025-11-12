import AddItemButton from "@/components/add-item-button";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

function Exercise(exercise: schema.ExercisesTableSelectType) {
    function handleOpenMenu() {
        alert ("handleOpenMenu");
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
            <Ionicons style={styles.text} name="ellipsis-vertical-sharp" size={24} onPress={handleOpenMenu} />
        </View>
    );
}

export default function ExercisesScreen() {
    const logDB = drizzle(useSQLiteContext(), { schema });
    const [exercises, setExercises] = useState<Array<schema.ExercisesTableSelectType>>([]);

    function handleCreateExercise() {
        alert ("handleCreateExercise");
    }
    
    useEffect(() => {
        (async () => {
            const exercises = await logDB
                .select()
                .from(schema.ExercisesTable);
            setExercises(exercises);
        })();
    }, []);

    return (
        <View
            style={{
                ...styles.container,
                flex: 1,
                padding: 5,
            }}
        >
            {
                exercises.map((exercise) => (
                    <Exercise key={exercise.id} {...exercise} />
                ))
            }
            <AddItemButton onPress={handleCreateExercise} />
        </View>
    );
}
