PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_LogExercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`log_id` integer NOT NULL,
	`name` text NOT NULL,
	`set_count` integer NOT NULL,
	FOREIGN KEY (`log_id`) REFERENCES `Logs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_LogExercises`("id", "log_id", "name", "set_count") SELECT "id", "log_id", "name", "set_count" FROM `LogExercises`;--> statement-breakpoint
DROP TABLE `LogExercises`;--> statement-breakpoint
ALTER TABLE `__new_LogExercises` RENAME TO `LogExercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `Logs` ADD `startTime` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `Logs` ADD `endTime` integer;