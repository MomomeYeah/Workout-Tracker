CREATE TABLE `ExerciseCategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `Exercises` ADD `exercise_category` integer REFERENCES ExerciseCategories(id);--> statement-breakpoint
ALTER TABLE `Exercises` ADD `single_limb` integer DEFAULT false NOT NULL;