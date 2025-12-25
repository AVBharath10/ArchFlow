import { ProjectList } from "@/components/ProjectList";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { useUser, useLogout } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import { LogOut, LayoutDashboard, Home as HomeIcon } from "lucide-react";

export default function Dashboard() {
    const { data: user } = useUser();
    const logout = useLogout();
    const [location] = useLocation();

    if (!user) {
        // Should be handled by protected route wrapper, but just in case
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <a className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <img src="/logo.png" alt="ArchFlow" className="w-8 h-8 object-contain" />
                            </div>
                            ArchFlow
                        </a>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 hidden sm:inline-flex">
                                <HomeIcon className="w-4 h-4" /> Home
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="secondary" size="sm" className="gap-2">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Button>
                        </Link>

                        <div className="w-px h-6 bg-border mx-2" />

                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl || undefined} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="icon" onClick={() => logout.mutate()} title="Sign out">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your architecture projects</p>
                    </div>
                    <CreateProjectDialog />
                </div>

                <ProjectList />
            </main>
        </div>
    );
}
