import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SiGoogle, SiGithub } from "react-icons/si";
import { Redirect } from "wouter";
import { Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

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
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />

            <header className="absolute top-0 w-full z-50 p-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3 font-bold text-2xl tracking-tight">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <img src="/logo.png" alt="ArchFlow" className="w-12 h-12 object-contain" />
                            </div>
                            <span className="text-foreground">ArchFlow</span>
                        </div>
                    </div>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                        <CardHeader className="text-center space-y-2 pb-6">
                            <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
                            <CardDescription className="text-base">
                                Sign in to continue designing your architecture
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <Button
                                className="w-full h-11 flex items-center justify-center gap-3 text-base font-medium transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                variant="outline"
                                onClick={() => window.location.href = "/api/auth/google"}
                            >
                                <SiGoogle className="w-5 h-5" />
                                Continue with Google
                            </Button>

                            <Button
                                className="w-full h-11 flex items-center justify-center gap-3 text-base font-medium transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                variant="outline"
                                onClick={() => window.location.href = "/api/auth/github"}
                            >
                                <SiGithub className="w-5 h-5" />
                                Continue with GitHub
                            </Button>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
