import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { sql } from "drizzle-orm";

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
