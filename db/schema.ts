import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const LogsTable = sqliteTable("Logs", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    startTime: int().notNull(),
    endTime: int(),
});

export const LogsRelations = relations(LogsTable, ({ many }) => ({
	exercises: many(LogExercisesTable),
}));

export type LogsTableSelectType = typeof LogsTable.$inferSelect & {
    "exercises": Array<LogExercisesTableSelectType>
};

export const LogExercisesTable = sqliteTable("LogExercises", {
    id: int().primaryKey({ autoIncrement: true }),
    log_id: int().notNull().references(() => LogsTable.id),
    name: text().notNull(),
    set_count: int().notNull(),
});

export const LogExercisesRelations = relations(LogExercisesTable, ({ one }) => ({
    log: one(LogsTable, { fields: [LogExercisesTable.log_id], references: [LogsTable.id] })
}));

export type LogExercisesTableSelectType = typeof LogExercisesTable.$inferSelect;

/** Test Data */
// {
//     id: 4,
//     title: "Upper 2",
//     startTime: new Date(2025, 11, 1, 4, 30), -> 1764523800000
//     endTime: new Date(2025, 11, 1, 5, 15),   -> 1764526500000
//     exercises: [
//         {name: "Incline bench press", setCount: 2},
//         {name: "Military press", setCount: 2},
//         {name: "Bentover row", setCount: 2},
//         {name: "Close-grip pulldown", setCount: 2},
//     ]
// },
// {
//     id: 5,
//     title: "Legs",
//     startTime: new Date(2025, 11, 3, 5, 15), -> 1764699300000
//     endTime: new Date(2025, 11, 3, 5, 15),   -> 1764701220000
//     exercises: [
//         {name: "Hex-bar deadlift", setCount: 2},
//         {name: "Seated leg curls", setCount: 2},
//         {name: "Leg extensions", setCount: 2},
//     ]
// },
// {
//     id: 6,
//     title: "Upper 1",
//     startTime: new Date(2025, 11, 4, 6, 30), -> 1764790200000
//     endTime: new Date(2025, 11, 4, 6, 30),   -> 1764792600000
//     exercises: [
//         {name: "Dumbbell bench press", setCount: 2},
//         {name: "Seated shoulder press", setCount: 2},
//         {name: "Close-grip cable row", setCount: 2},
//         {name: "Pulldown", setCount: 2},
//     ]
// },