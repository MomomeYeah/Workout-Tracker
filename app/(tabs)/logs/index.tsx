import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        padding: 5,
    },
    workout: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5,
        padding: 10,
        paddingLeft: 0,
        marginBottom: 10,
    },
    item: {
        color: "#fff",
    },
});

type WorkoutExercise = {
    name: string,
    setCount: number,
}
type WorkoutProps = {
    id: string,
    date: Date,
    title: string,
    duration: number,
    exercises: Array<WorkoutExercise>,
}
function Workout(item: WorkoutProps) {
    const router = useRouter();

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEV"];

    function gotoWorkout() {
        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: item.id,
            },
        });
    }

    return (
        <Pressable style={styles.workout} onPress={gotoWorkout}>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text style={styles.item}>{daysOfWeek[item.date.getDay()]}</Text>
                <Text style={styles.item}>{item.date.getDate().toString().padStart(2, "0")}</Text>
                <Text style={styles.item}>{months[item.date.getMonth() - 1]}</Text>
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
                    <Text style={styles.item}>{item.title}</Text>
                    <Text style={styles.item}>{item.duration} mins</Text>
                </View>
                <View>
                    {
                        item.exercises.map((exercise, index) => {
                            return (
                                <Text
                                    key={index}
                                    style={styles.item}
                                >
                                    {exercise.setCount}x {exercise.name}
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
    const router = useRouter();

    function handleCreateWorkout() {
        router.navigate({
            pathname: "/(tabs)/logs/[id]",
            params: {
                id: "aaaabbbb-cccc-dddd-eeee-ffffgggghhhh",
            },
        });
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={[
                    {
                        id: "d9c3b0b4-c113-4a04-82eb-1f530c548f6a",
                        date: new Date(2025, 11, 1, 4, 30),
                        title: "Upper 2",
                        duration: 45,
                        exercises: [
                            {name: "Incline bench press", setCount: 2},
                            {name: "Military press", setCount: 2},
                            {name: "Bentover row", setCount: 2},
                            {name: "Close-grip pulldown", setCount: 2},
                        ]
                    },
                    {
                        id: "24599481-e716-4ada-b54d-0002d4d527cb",
                        date: new Date(2025, 11, 3, 5, 15),
                        title: "Legs",
                        duration: 32,
                        exercises: [
                            {name: "Hex-bar deadlift", setCount: 2},
                            {name: "Seated leg curls", setCount: 2},
                            {name: "Leg extensions", setCount: 2},
                        ]
                    },
                    {
                        id: "51198a5e-4cfa-4189-b426-c8bb0d4454d5",
                        date: new Date(2025, 11, 4, 6, 30),
                        title: "Upper 1",
                        duration: 40,
                        exercises: [
                            {name: "Dumbbell bench press", setCount: 2},
                            {name: "Seated shoulder press", setCount: 2},
                            {name: "Close-grip cable row", setCount: 2},
                            {name: "Pulldown", setCount: 2},
                        ]
                    },
                ]}
                renderItem={({item}) => (
                    <Workout {...item} />
                )}
            />
            <Pressable
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    height: 50,
                    width: 50,
                    backgroundColor: "#fff",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                }}
                onPress={handleCreateWorkout}
            >
                <Ionicons name="add-outline" size={32} />
            </Pressable>
        </View>
    );
}
