import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  datetime,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────
// users
// ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────
// activity_logs
// ─────────────────────────────────────────────
export const activityLogs = mysqlTable("activity_logs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 50 }).notNull(), // create | update | delete
  module: varchar("module", { length: 100 }).notNull(), // e.g. 'tenaga_pendidikan'
  entityId: int("entity_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// ─────────────────────────────────────────────
// tenaga_pendidikan
// ─────────────────────────────────────────────
export const tenagaPendidikan = mysqlTable("tenaga_pendidikan", {
  id: int("id").primaryKey().autoincrement(),
  photoUrl: varchar("photo_url", { length: 500 }),
  nuptk: varchar("nuptk", { length: 20 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  jabatan: varchar("jabatan", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  deletedAt: datetime("deleted_at"),
});

export type TenagaPendidikan = typeof tenagaPendidikan.$inferSelect;
export type NewTenagaPendidikan = typeof tenagaPendidikan.$inferInsert;
