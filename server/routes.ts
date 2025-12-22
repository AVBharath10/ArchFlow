
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { Server as SocketIOServer } from "socket.io";

import passport from "passport";

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/auth" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Socket.IO Setup
  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("join-project", (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    socket.on("canvas-update", (data: { projectId: string; state: any }) => {
      // Broadcast to others in the room
      socket.to(`project:${data.projectId}`).emit("canvas-update", data.state);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  // REST APIs
  app.get(api.projects.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const projects = await storage.listProjects(userId);
    res.json(projects);
  });

  app.get(api.projects.get.path, isAuthenticated, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Check ownership
    if (project.userId !== (req.user as any).id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(project);
  });

  app.post(api.projects.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const userId = (req.user as any).id;
      const project = await storage.createProject({ ...input, userId });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.projects.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.projects.update.input.parse(req.body);
      // Verify ownership before update
      const existing = await storage.getProject(Number(req.params.id));
      if (!existing) return res.status(404).json({ message: "Not found" });
      if (existing.userId !== (req.user as any).id) return res.status(403).json({ message: "Forbidden" });

      const project = await storage.updateProject(Number(req.params.id), input);
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
