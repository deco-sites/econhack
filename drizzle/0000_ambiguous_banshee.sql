CREATE TABLE `reservations` (
	`message` text,
	`username` text,
	`itemUrl` text,
	FOREIGN KEY (`username`) REFERENCES `invitees`(`username`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`itemUrl`) REFERENCES `products`(`url`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invitees` (
	`username` text,
	`passkey` text
);
--> statement-breakpoint
CREATE TABLE `products` (
	`url` text PRIMARY KEY NOT NULL,
	`id` text,
	`name` text,
	`imageUrl` text,
	`price` real
);
