
import { db } from "./db";
import {
  projects,
  type Project,
  type InsertProject,
  type CanvasState
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  listProjects(): Promise<Project[]>;
}

export class DatabaseStorage implements IStorage {
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const [project] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async listProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
}

export const storage = new DatabaseStorage();
