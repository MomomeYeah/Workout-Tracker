import AddItemButton from "@/components/add-item-button";
import ThemedCard from "@/components/themed-card";
import ThemedText from "@/components/themed-text";
import ThemedView from "@/components/themed-view";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Workout(item: schema.LogsTableSelectType) {
    const router = useRouter();

    const startTime = new Date(item.startTime);
    const endTime = item.endTime ? new Date(item.endTime) : null;
    const durationMins = item.endTime ? Math.floor((item.endTime - item.startTime) / 1000 / 60) : null;
    const duration = durationMins ? `${durationMins} mins` : "";

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    async function gotoWorkout() {
        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: item.id,
            },
        });
    }

    return (
        <Pressable onPress={gotoWorkout}>
            <ThemedCard
                style={{
                    paddingLeft: 0,
                    flex: 1,
                    flexDirection: "row",
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ThemedText>{daysOfWeek[startTime.getDay()]}</ThemedText>
                    <ThemedText>{startTime.getDate().toString().padStart(2, "0")}</ThemedText>
                    <ThemedText>{months[startTime.getMonth()]}</ThemedText>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        flexGrow: 5,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <ThemedText style={{...styles.h3}}>{item.title}</ThemedText>
                        <ThemedText>{duration}</ThemedText>
                    </View>
                    <View>
                        {
                            item.exercises.map((exercise, index) => {
                                return (
                                    <ThemedText key={index}>
                                        { exercise.sets.length }x {exercise.exercise?.name}
                                    </ThemedText>
                                )
                            })
                        }
                    </View>
                </View>
            </ThemedCard>
        </Pressable>
    );
}

function LogsHeader() {
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
            <ThemedText style={{...styles.h1}}>Workout Logs</ThemedText>
        </ThemedView>
    );
}

function EmptyLogsPlaceholder() {
    return (
        <ThemedCard>
            <ThemedText style={{...styles.h2, marginBottom: 10}}>No workouts yet</ThemedText>
            <ThemedText style={{marginBottom: 10}}>Your workouts will appear here.</ThemedText>
            <ThemedText>Press the add button below to create your first workout.</ThemedText>
        </ThemedCard>
    )
}

export default function Index() {
    const logDB = drizzle(useSQLiteContext(), { schema });
    useDrizzleStudio(useSQLiteContext());

    const router = useRouter();
    async function handleCreateWorkout() {
        const newLog = await logDB
            .insert(schema.LogsTable)
            .values({
                title: "New Workout",
                startTime: new Date().getTime(),
            }).returning();

        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: newLog[0].id,
            },
        });
    }

    const [logs, setLogs] = useState<Array<schema.LogsTableSelectType>>([]);
    useFocusEffect(
        React.useCallback(() => {
            async function getLogs() {
                const logs = await logDB
                    .query.LogsTable
                    .findMany({
                        with: {
                            exercises: {
                                with: {
                                    exercise: true,
                                    sets: true,
                                }
                            }
                        },
                        orderBy: [
                            desc(schema.LogsTable.startTime),
                            asc(schema.LogsTable.title)
                        ]
                    })

                setLogs(logs);
            }

            getLogs();

            return () => {
                // cleanup function for when component loses focus
            }
        }, [])
    );

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
        }}>
            <FlatList
                data={logs}
                renderItem={({item}) => (
                    <Workout {...item} />
                )}
                keyExtractor={log => log.id.toString()}
                ListHeaderComponent={<LogsHeader />}
                stickyHeaderIndices={[0]}
                ListEmptyComponent={<EmptyLogsPlaceholder />}
            />
            <AddItemButton onPress={handleCreateWorkout} />
        </SafeAreaView>
    );
}
