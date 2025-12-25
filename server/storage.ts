
import { db } from "./db";
import {
  projects,
  type Project,
  type InsertProject,
  type CanvasState
} from "@shared/schema";
import { eq } from "drizzle-orm";

import { users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  listProjects(userId: number): Promise<Project[]>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteProject(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject & { userId: number }): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject as any).returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [project] = await db.update(projects)
      .set(updates as any)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async listProjects(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }
}

export const storage = new DatabaseStorage();
