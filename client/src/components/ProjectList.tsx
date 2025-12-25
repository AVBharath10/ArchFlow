import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { Box, Code2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function ProjectList() {
    const { data: projects, isLoading, isError } = useProjects();
    const deleteProject = useDeleteProject();
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

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
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="group relative">
                        <Link href={`/projects/${project.id}`}>
                            <a className="block h-full">
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

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete "{project.name}" and all its data. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive hover:bg-destructive/90"
                                            onClick={() => deleteProject.mutate(project.id)}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
