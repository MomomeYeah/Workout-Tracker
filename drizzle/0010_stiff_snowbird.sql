PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`exercise_category_id` integer,
	`single_limb` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`exercise_category_id`) REFERENCES `ExerciseCategories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Exercises`("id", "name", "exercise_category_id", "single_limb") SELECT "id", "name", "exercise_category_id", "single_limb" FROM `Exercises`;--> statement-breakpoint
DROP TABLE `Exercises`;--> statement-breakpoint
ALTER TABLE `__new_Exercises` RENAME TO `Exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;