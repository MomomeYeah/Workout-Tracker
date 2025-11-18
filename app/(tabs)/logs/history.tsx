import ThemedCard from "@/components/themed-card";
import ThemedText from "@/components/themed-text";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function HistoryItem(item: schema.LogExercisesHistorySelectType) {
    const logDate = new Date(item.log.startTime);
    const historyItemDateFormatter = new Intl.DateTimeFormat('en-AU', {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric"

    });

    return (
        <ThemedCard>
            <ThemedText style={{...styles.h3}}>{historyItemDateFormatter.format(logDate)}</ThemedText>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 5,
                }}
            >
                <ThemedText style={{flexGrow: 1, flexBasis: 0, fontWeight: "bold"}}>Type</ThemedText>
                <ThemedText style={{flexGrow: 1, flexBasis: 0, fontWeight: "bold"}}>Weight</ThemedText>
                <ThemedText style={{flexGrow: 1, flexBasis: 0, fontWeight: "bold"}}>Reps</ThemedText>
                <ThemedText style={{flexGrow: 1, flexBasis: 0, fontWeight: "bold"}}>Notes</ThemedText>
            </View>
            {
                item.sets.map((set) => {
                    return <View
                        key={set.id}
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 5,
                        }}
                    >
                        <ThemedText style={{flexGrow: 1, flexBasis: 0}}>{set.set_type}</ThemedText>
                        <ThemedText style={{flexGrow: 1, flexBasis: 0}}>{set.weight}</ThemedText>
                        <ThemedText style={{flexGrow: 1, flexBasis: 0}}>{set.reps}</ThemedText>
                        <ThemedText style={{flexGrow: 1, flexBasis: 0}}>{set.notes}</ThemedText>
                    </View>
                })
            }
        </ThemedCard>
    )
}

function HistoryHeader() {
    return (
        <ThemedView
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
            }}
        >
            <ThemedText style={{...styles.h1}}>Exercise History</ThemedText>
        </ThemedView>
    );
}

export default function ExerciseHistory() {
    const { exercise_id } = useLocalSearchParams();
    const router = useRouter();

    const logDB = drizzle(useSQLiteContext(), { schema });
    const [exercises, setExercises] = useState<Array<schema.LogExercisesHistorySelectType>>([]);
    
    useEffect(() => {
            (async () => {
                const log_exercises = await logDB
                    .query.LogExercisesTable.findMany({
                        where: eq(schema.LogExercisesTable.exercise_id, +exercise_id),
                        with: {
                            log: true,
                            exercise: true,
                            sets: true,
                        },
                    });

                if(log_exercises) {
                    setExercises(log_exercises.sort((a, b) => b.log.startTime - a.log.startTime));
                }
            })();
        }, []);

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
        }}>
            <FlatList
                data={exercises}
                renderItem={({item}) => (
                    <HistoryItem {...item} />
                )}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={<HistoryHeader />}
                stickyHeaderIndices={[0]}
            />
        </SafeAreaView>
    )
}