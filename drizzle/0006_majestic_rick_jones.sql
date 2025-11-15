ALTER TABLE `LogExerciseSets` ADD `set_type` text DEFAULT 'Normal' NOT NULL;--> statement-breakpoint
ALTER TABLE `Logs` ADD `workout_type` text DEFAULT 'Normal' NOT NULL;--> statement-breakpoint
ALTER TABLE `Logs` ADD `bodyweight` numeric;