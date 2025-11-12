import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import * as seedData from "@/db/seed-data";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, Text, View } from "react-native";

export default function SeedScreen() {
    const logDB = drizzle(useSQLiteContext(), { schema });

    async function handleSeed() {
        await logDB.delete(schema.LogExerciseSetsTable);
        await logDB.delete(schema.LogExercisesTable);
        await logDB.delete(schema.LogsTable);
        await logDB.delete(schema.ExercisesTable);

        console.log("Tables cleared");

        seedData.exercises.map(async (exercise) => {
            await logDB
                .insert(schema.ExercisesTable)
                .values({
                    name: exercise.name
                });
        });

        console.log("Exercises created");

        seedData.logs.map(async (log) => {
            await logDB
                .insert(schema.LogsTable)
                .values({
                    title: log.title,
                    startTime: log.startTime,
                    endTime: log.endTime,
                });
        });

        console.log("Logs created");

        seedData.log_exercises.map(async (logExercise) => {
            const log_id = await logDB
                .select()
                .from(schema.LogsTable)
                .where(eq(schema.LogsTable.title, logExercise.log));

            const exercise_id = await logDB
                .select()
                .from(schema.ExercisesTable)
                .where(eq(schema.ExercisesTable.name, logExercise.exercise));

            const log_exercise_id = await logDB
                .insert(schema.LogExercisesTable)
                .values({
                    log_id: log_id[0].id,
                    exercise_id: exercise_id[0].id,
                }).returning();

            logExercise.sets.map(async (set) => {
                await logDB
                    .insert(schema.LogExerciseSetsTable)
                    .values({
                        log_exercise_id: log_exercise_id[0].id,
                        weight: set.weight,
                        reps: set.reps,
                    });
            })
        });

        console.log("Logs exercises created");
    };

    return (
        <View style={{...styles.container, ...styles.centredFlex}}>
            <Text style={styles.text}>Seed screen</Text>
            <Button title="Go" onPress={handleSeed} />
        </View>
    );
}