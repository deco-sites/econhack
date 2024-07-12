import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const invitees = sqliteTable("invitees", {
  username: text("username"),
  passkey: text("passkey"),
});

export const items = sqliteTable("items", {
  url: text("url").primaryKey(),
  id: text("id"),
  name: text("name"),
  imageUrl: text("imageUrl"),
  price: real("price"),
});

export const gifts = sqliteTable("gifts", {
  message: text("message"),
  username: text("username").references(() => invitees.username),
  itemUrl: text("itemUrl").references(() => items.url),
});

export const inviteesRelations = relations(invitees, ({ many }) => ({
  gifts: many(gifts),
}));

export const giftsRelations = relations(gifts, ({ one }) => ({
  invitee: one(invitees),
  item: one(items),
}));
