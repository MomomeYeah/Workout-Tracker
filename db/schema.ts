import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ExercisesTable = sqliteTable("Exercises", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
});

export type ExercisesTableSelectType = typeof ExercisesTable.$inferSelect;

export const LogsTable = sqliteTable("Logs", {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    startTime: int().notNull(),
    endTime: int(),
    notes: text(),
});

export const LogsRelations = relations(LogsTable, ({ many }) => ({
	exercises: many(LogExercisesTable),
}));

export type LogsTableSelectType = typeof LogsTable.$inferSelect & {
    "exercises": Array<LogExercisesTableSelectType>
};

export const LogExercisesTable = sqliteTable("LogExercises", {
    id: int().primaryKey({ autoIncrement: true }),
    log_id: int().notNull().references(() => LogsTable.id, {onDelete: "cascade"}),
    exercise_id: int().notNull().references(() => ExercisesTable.id, {onDelete: "cascade"}),
});

export const LogExercisesRelations = relations(LogExercisesTable, ({ one, many }) => ({
    log: one(LogsTable, { fields: [LogExercisesTable.log_id], references: [LogsTable.id] }),
    exercise: one(ExercisesTable, { fields: [LogExercisesTable.exercise_id], references: [ExercisesTable.id] }),
    sets: many(LogExerciseSetsTable),
}));

export type LogExercisesTableSelectType = typeof LogExercisesTable.$inferSelect & {
    "exercise": ExercisesTableSelectType,
    "sets": Array<LogExerciseSetsTableSelectType>,
};

export const LogExerciseSetsTable = sqliteTable("LogExerciseSets", {
    id: int().primaryKey({ autoIncrement: true }),
    log_exercise_id: int().notNull().references(() => LogExercisesTable.id, {onDelete: "cascade"}),
    weight: int(),
    reps: int(),
    notes: text(),
});

export const LogExerciseSetsRelations = relations(LogExerciseSetsTable, ({ one }) => ({
    log_exercise: one(LogExercisesTable, { fields: [LogExerciseSetsTable.log_exercise_id], references: [LogExercisesTable.id] }),
}));

export type LogExerciseSetsTableSelectType = typeof LogExerciseSetsTable.$inferSelect