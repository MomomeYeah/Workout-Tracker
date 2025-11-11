CREATE TABLE `Exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `LogExerciseSets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`log_exercise_id` integer NOT NULL,
	`weight` integer,
	`reps` integer,
	`notes` text,
	FOREIGN KEY (`log_exercise_id`) REFERENCES `LogExercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_LogExercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`log_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`log_id`) REFERENCES `Logs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `Exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_LogExercises`("id", "log_id", "exercise_id") SELECT "id", "log_id", "exercise_id" FROM `LogExercises`;--> statement-breakpoint
DROP TABLE `LogExercises`;--> statement-breakpoint
ALTER TABLE `__new_LogExercises` RENAME TO `LogExercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `Logs` ADD `notes` text;