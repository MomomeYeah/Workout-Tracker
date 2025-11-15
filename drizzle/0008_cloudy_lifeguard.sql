PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_type` text DEFAULT 'Normal' NOT NULL,
	`title` text NOT NULL,
	`bodyWeight` real,
	`startTime` integer NOT NULL,
	`endTime` integer,
	`notes` text
);
--> statement-breakpoint
INSERT INTO `__new_Logs`("id", "workout_type", "title", "bodyWeight", "startTime", "endTime", "notes") SELECT "id", "workout_type", "title", "bodyWeight", "startTime", "endTime", "notes" FROM `Logs`;--> statement-breakpoint
DROP TABLE `Logs`;--> statement-breakpoint
ALTER TABLE `__new_Logs` RENAME TO `Logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;