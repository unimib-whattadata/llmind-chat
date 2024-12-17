// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import {
  pgTableCreator,
  serial,
  pgEnum,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `micare-chat_${name}`);

// schema tables
export const messageRoleEnum = pgEnum("messageRole", ["AI", "USER"]);
export const messageTypeEnum = pgEnum("messageType", [
  "CLINICAL",
  "DIAGNOSIS",
  "VALIDATION",
  "SCORE",
  "NOTE",
  "DEFAULT",
]);
export const currentOperationEnum = pgEnum("currentOperation", [
  "VALIDATION",
  "SCORE",
  "NOTE",
  "FINISHED",
]);

export const validationEnum = pgEnum("validation", ["CORRECT", "INCORRECT"]);
export const chat = createTable("chat", {
  id: serial("id").primaryKey().notNull(),
  chatName: varchar("chatName", { length: 256 }).notNull(),
});

export const diagnosis = createTable("diagnosis", {
  id: serial("id").primaryKey().notNull(),
  diagnosis: varchar("diagnosis").notNull(),
  clinicalCase: varchar("clinicalCase").notNull(),
  currentOperation: currentOperationEnum("currentOperation").notNull(),
  validation: validationEnum("validation"),
  score: varchar("score"),
  note: varchar("note"),
});

export const message = createTable("message", {
  id: serial("id").primaryKey().notNull(),
  text: varchar("text").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  role: messageRoleEnum("role").notNull(),
  hasValidation: boolean("hasValidation").notNull(),
  messageType: messageTypeEnum("messageType").notNull(),
  title: varchar("title"),
  orderNumber: integer("orderNumber"),
  chatId: integer("chatId").references(() => chat.id), // Foreign key
  diagnosisBlock: integer("diagnosisBlock").references(() => diagnosis.id), // Foreign key
});

// Relations
export const chatsRelations = relations(chat, ({ many }) => ({
  messages: many(message),
}));

export const diagnosisRelations = relations(diagnosis, ({ many }) => ({
  blockMessages: many(message),
}));

export const messagesRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
  diagnosisBlock: one(diagnosis, {
    fields: [message.diagnosisBlock],
    references: [diagnosis.id],
  }),
}));
