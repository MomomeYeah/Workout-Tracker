CREATE TABLE `LogExercises` (
	`log_id` integer NOT NULL,
	`name` text NOT NULL,
	`set_count` integer NOT NULL,
	FOREIGN KEY (`log_id`) REFERENCES `Logs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` integer NOT NULL,
	`tite` text NOT NULL,
	`duration` integer NOT NULL
);
