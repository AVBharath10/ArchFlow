import { Link } from "wouter";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { ArrowRight, Box, Code2, Network, Zap, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useUser, useLogout } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function LandingHero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6 backdrop-blur-sm">
            <Zap className="mr-2 h-3.5 w-3.5" />
            <span className="font-medium">Visual API Architecture</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
            Design your backend <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
              like a pro
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
            Drag-and-drop services, endpoints, and data models to visualize your API architecture.
            Export OpenAPI specs automatically. Built for developers who care about design.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CreateProjectDialog />
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="#projects">
                View Projects <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Mockup / Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-16 rounded-xl border border-border bg-card/50 shadow-2xl overflow-hidden backdrop-blur-sm mx-auto max-w-5xl"
        >
          <div className="h-8 bg-muted/40 border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
            <div className="ml-4 h-4 w-64 bg-muted/50 rounded-full" />
          </div>
          <div className="aspect-[16/9] bg-grid-white/[0.02] relative p-8 flex items-center justify-center">
            {/* Abstract representation of canvas */}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            <div className="flex gap-12 items-center opacity-80">
              <div className="w-32 h-32 rounded-lg border-2 border-primary/50 bg-primary/10 flex items-center justify-center">
                <Box className="w-12 h-12 text-primary" />
              </div>
              <div className="h-0.5 w-24 bg-gradient-to-r from-primary/50 to-blue-500/50" />
              <div className="w-32 h-32 rounded-lg border-2 border-blue-500/50 bg-blue-500/10 flex items-center justify-center">
                <Network className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectList() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load projects</p>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-24 border border-dashed border-border rounded-xl bg-muted/5">
        <Code2 className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
        <p className="text-muted-foreground mb-6">Create your first architecture diagram.</p>
        <CreateProjectDialog />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <a className="group block">
            <Card className="h-full p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 bg-card/50 hover:bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Box className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDistanceToNow(new Date(project.createdAt!), { addSuffix: true })}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Contains {(project.canvasState as any)?.nodes?.length || 0} nodes
              </p>
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: user } = useUser();
  const logout = useLogout();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            ArchFlow
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block">{user.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout.mutate()}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <a href="https://github.com" target="_blank" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
                <Link href="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <LandingHero />

        <section id="projects" className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Your Projects</h2>
                <p className="text-muted-foreground mt-1">Manage your architecture diagrams</p>
              </div>
              {user && <CreateProjectDialog />}
            </div>

            {user ? (
              <ProjectList />
            ) : (
              <div className="text-center py-24 border border-dashed border-border rounded-xl bg-muted/5">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <Zap className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Sign in to view projects</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create an account or sign in to start building and saving your architecture diagrams.
                </p>
                <Link href="/auth">
                  <Button size="lg" className="px-8">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 ArchFlow. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}
