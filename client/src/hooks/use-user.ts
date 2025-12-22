import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useUser() {
    return useQuery<User | null>({
        queryKey: ["/auth/me"],
        queryFn: async () => {
            const res = await fetch("/auth/me");
            if (!res.ok) {
                if (res.status === 401) return null;
                throw new Error("Failed to fetch user");
            }
            return await res.json();
        },
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch("/auth/logout", { method: "POST" });
            if (!res.ok) throw new Error("Logout failed");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/auth/me"], null);
            toast({
                title: "Logged out",
                description: "You have been partially logged out.",
            });
            window.location.href = "/"; // Hard reload/redirect to ensure state clear
        },
    });
}
