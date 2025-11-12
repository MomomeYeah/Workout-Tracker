import AddItemButton from "@/components/add-item-button";
import { styles } from "@/constants/theme";
import * as schema from "@/db/schema";
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useRouter } from "expo-router";
import { useSQLiteContext } from 'expo-sqlite';
import {
    FlatList,
    Pressable,
    Text,
    View
} from "react-native";

function Workout(item: schema.LogsTableSelectType) {
    const router = useRouter();

    const startTime = new Date(item.startTime);
    const endTime = item.endTime ? new Date(item.endTime) : null;
    const durationMins = item.endTime ? Math.floor((item.endTime - item.startTime) / 1000 / 60) : null;
    const duration = durationMins ? `${durationMins} mins` : "";

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEV"];

    async function gotoWorkout() {
        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: item.id,
            },
        });
    }

    return (
        <Pressable
            style={{
                ...styles.card,
                paddingLeft: 0,
                flex: 1,
                flexDirection: "row",
            }}
            onPress={gotoWorkout}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={styles.text}>{daysOfWeek[startTime.getDay()]}</Text>
                <Text style={styles.text}>{startTime.getDate().toString().padStart(2, "0")}</Text>
                <Text style={styles.text}>{months[startTime.getMonth() - 1]}</Text>
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
                    <Text style={styles.text}>{item.title}</Text>
                    <Text style={styles.text}>{duration}</Text>
                </View>
                <View>
                    {
                        item.exercises.map((exercise, index) => {
                            return (
                                <Text
                                    key={index}
                                    style={styles.text}
                                >
                                    { exercise.sets.length }x {exercise.exercise?.name}
                                </Text>
                            )
                        })
                    }
                </View>
            </View>
        </Pressable>
    );
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

    const { data: logs, error, updatedAt } = useLiveQuery(
        logDB.query.LogsTable.findMany({
            with: {
                exercises: {
                    with: {
                        exercise: true,
                        sets: true,
                    }
                }
            }
        })
    );

    return (
        <View style={{
            ...styles.container,
            flex: 1,
        }}>
            <FlatList
                data={logs}
                renderItem={({item}) => (
                    <Workout {...item} />
                )}
                keyExtractor={log => log.id.toString()}
            />
            <AddItemButton onPress={handleCreateWorkout} />
        </View>
    );
}
