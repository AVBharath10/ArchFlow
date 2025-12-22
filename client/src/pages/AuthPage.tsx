import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SiGoogle, SiGithub } from "react-icons/si";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
    const { data: user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user) {
        return <Redirect to="/" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to manage your system architecture diagrams
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        className="w-full flex items-center gap-2"
                        variant="outline"
                        onClick={() => window.location.href = "/auth/google"}
                    >
                        <SiGoogle className="w-4 h-4" />
                        Sign in with Google
                    </Button>

                    <Button
                        className="w-full flex items-center gap-2"
                        variant="outline"
                        onClick={() => window.location.href = "/auth/github"}
                    >
                        <SiGithub className="w-4 h-4" />
                        Sign in with GitHub
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
