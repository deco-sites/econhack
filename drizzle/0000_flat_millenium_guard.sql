CREATE TABLE `products` (
	`url` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`message` text,
	`username` text,
	`productUrl` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`username` text PRIMARY KEY NOT NULL,
	`email` text
);
