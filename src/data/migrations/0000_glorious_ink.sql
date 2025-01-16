CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`icon` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
