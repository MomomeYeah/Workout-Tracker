import * as schema from "@/db/schema";
import * as seedData from "@/db/seed-data";
import { eq, sql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { Button, View } from "react-native";

export default function SeedScreen() {
    const logDB = drizzle(useSQLiteContext(), { schema });

    async function truncateData() {
        await logDB.delete(schema.LogExerciseSetsTable);
        await logDB.delete(schema.LogExercisesTable);
        await logDB.delete(schema.LogsTable);
        await logDB.delete(schema.ExercisesTable);

        console.log("Tables cleared");
    }

    async function handleSeedRealistic() {
        await truncateData();

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

        console.log("Log exercises created");
    };

    async function handleSeedVolume() {
        await truncateData();

        const exerciseCount = 100;
        for (let i = 0; i < exerciseCount; i++) {
            await logDB
                .insert(schema.ExercisesTable)
                .values({
                    name: `Exercise ${i}`
                });
        }

        console.log("Exercises created");

        const logCount = 100;
        for (let i = 0; i < logCount; i++) {
            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + Math.floor(Math.random() * 3600000));

            // insert log record
            const newLog = await logDB
                .insert(schema.LogsTable)
                .values({
                    title: `Log ${i}`,
                    startTime: startTime.getTime(),
                    endTime: endTime.getTime(),
                }).returning();

            // pick 4 random exercises and add them
            const logExercises = await logDB
                .select()
                .from(schema.ExercisesTable)
                .orderBy(sql`RANDOM()`)
                .limit(4);

            for (let j = 0; j < logExercises.length; j++) {
                const newLogExercise = await logDB
                    .insert(schema.LogExercisesTable)
                    .values({
                        log_id: newLog[0].id,
                        exercise_id: logExercises[j].id
                    }).returning();

                // add two sets to each exercise
                for (let k = 0; k < 2; k++) {
                    await logDB
                        .insert(schema.LogExerciseSetsTable)
                        .values({
                            log_exercise_id: newLogExercise[0].id,
                            weight: Math.floor(Math.random() * 100),
                            reps: Math.floor(Math.random() * 10),
                        });
                }
            }
        }

        console.log("Logs created");
    }

    return (
        <View
            style={{
                margin: 50,
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <View style={{marginBottom: 20}}>
                <Button title="Clear All Data" onPress={truncateData}  />
            </View>
            <View style={{marginBottom: 20}}>
                <Button title="Seed Realistic Test Data" onPress={handleSeedRealistic}  />
            </View>
            <View>
                <Button title="Seed Volume Random Data" onPress={handleSeedVolume} />
            </View>
        </View>
    );
}