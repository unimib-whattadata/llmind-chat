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
  "MODEL-DIAGNOSIS",
  "SCORE",
  "NOTE",
  "DEFAULT",
]);
export const currentOperationEnum = pgEnum("currentOperation", [
  "SCORE",
  "NOTE",
  "FINISHED",
]);

export const diagnosis = createTable("diagnosis", {
  id: serial("id").primaryKey().notNull(),
  diagnosis: varchar("diagnosis").notNull(),
  title: varchar("title").notNull(),
  section: varchar("section").notNull(),
  clinicalCase: varchar("clinicalCase").notNull(),
  currentOperation: currentOperationEnum("currentOperation").notNull(),
  score: varchar("score"),
  note: varchar("note"),
  userId: integer("userId")
    .references(() => user.id)
    .notNull(), // Foreign key
});

export const clinicalMessage = createTable("clinicalMessage", {
  id: serial("id").primaryKey().notNull(),
  diagnosisId: integer("diagnosisId")
    .unique()
    .references(() => diagnosis.id)
    .notNull(), // One-to-One Foreign key
  clinicalMessage: integer("clinicalMessage")
    .unique()
    .references(() => message.id)
    .notNull(), // First message
  diagnosisMessage: integer("diagnosisMessage")
    .unique()
    .references(() => message.id)
    .notNull(), // Second message
  diagnosisLLMindMessage: integer("diagnosisLLMindMessage")
    .unique()
    .references(() => message.id)
    .notNull(), // Third message
});

export const user = createTable("user", {
  id: serial("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
});

export const chat = createTable("chat", {
  id: serial("id").primaryKey().notNull(),
  chatName: varchar("chatName", { length: 256 }).notNull(),
  userId: integer("userId").references(() => user.id), // Foreign key
});

export const message = createTable("message", {
  id: serial("id").primaryKey().notNull(),
  text: varchar("text").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  role: messageRoleEnum("role").notNull(),
  hasSkip: boolean("hasSkip").notNull(),
  messageType: messageTypeEnum("messageType").notNull(),
  title: varchar("title"),
  orderNumber: integer("orderNumber"),
  chatId: integer("chatId").references(() => chat.id), // Foreign key
  diagnosisBlock: integer("diagnosisBlock").references(() => diagnosis.id), // Foreign key
});

// Relations
export const chatsRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
}));

export const clinicalMessageRelations = relations(
  clinicalMessage,
  ({ one }) => ({
    diagnosis: one(diagnosis, {
      fields: [clinicalMessage.diagnosisId],
      references: [diagnosis.id],
    }),
    clinicalMessage: one(message, {
      fields: [clinicalMessage.clinicalMessage],
      references: [message.id],
    }),
    diagnosisMessage: one(message, {
      fields: [clinicalMessage.diagnosisMessage],
      references: [message.id],
    }),
    diagnosisLLMindMessage: one(message, {
      fields: [clinicalMessage.diagnosisLLMindMessage],
      references: [message.id],
    }),
  }),
);

export const diagnosisRelations = relations(diagnosis, ({ many, one }) => ({
  blockMessages: many(message),
  clinicalMessage: one(clinicalMessage, {
    fields: [diagnosis.id],
    references: [clinicalMessage.diagnosisId],
  }),
  userId: one(user, {
    fields: [diagnosis.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  chats: many(chat),
  diagnosis: many(diagnosis),
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
