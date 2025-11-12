import migrations from "@/drizzle/migrations";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
    const databaseName = "LogDatabase";

    return (
        <SQLiteProvider
            databaseName={databaseName}
            options={{ enableChangeListener: true }}
            onInit={async (database) => {
                try {
                    const db = drizzle(database);
                    await migrate(db, migrations);
                    console.log("Migration success");
                } catch (error) {
                    console.error("Migration error", error);
                }
            }}
        >
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SQLiteProvider>
    )
}
