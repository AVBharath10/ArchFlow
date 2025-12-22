
import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  googleId: text("google_id"),
  githubId: text("github_id"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id), // Link project to user
  canvasState: jsonb("canvas_state").$type<CanvasState>().default({ nodes: [], edges: [] }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, userId: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// === Canvas Types ===
export type NodeType = 'service' | 'endpoint' | 'model';

export interface CanvasNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  data: NodeData;
}

export type NodeData = ServiceData | EndpointData | ModelData;

export interface ServiceData {
  description?: string;
}

export interface EndpointData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary?: string;
}

export interface ModelData {
  fields: string; // e.g. "id: string, name: string"
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
}

export interface CanvasState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}
