import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  username: text("username").primaryKey(),
  email: text("email"),
});

export const products = sqliteTable("products", {
  url: text("url").primaryKey(),
});

export const reservations = sqliteTable("reservations", {
  message: text("message"),
  username: text("username"),
  productUrl: text("productUrl"),
});

export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.username],
    references: [users.username],
  }),
}));
