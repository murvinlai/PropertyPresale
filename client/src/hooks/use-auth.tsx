import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";

type AuthContextType = {
    user: SelectUser | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: any;
    logoutMutation: any;
    registerMutation: any;
    verifyRealtorMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const { data: user, error, isLoading } = useQuery<SelectUser | null, Error>({
        queryKey: ["/api/user"],
        queryFn: async () => {
            const res = await fetch("/api/user");
            if (res.status === 401 || res.status === 403) {
                return null;
            }
            if (!res.ok) {
                throw new Error("Failed to fetch user");
            }
            return res.json();
        },
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Login failed");
            }
            return res.json();
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Registration failed");
            }
            return res.json();
        },
        onSuccess: (user: SelectUser) => {
            queryClient.setQueryData(["/api/user"], user);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await fetch("/api/logout", { method: "POST" });
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
        },
    });

    const verifyRealtorMutation = useMutation({
        mutationFn: async (data: { licenseNumber: string; name: string }) => {
            const res = await fetch("/api/verify-realtor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error);
            if (!result.isValid) throw new Error(result.error || "Verification failed");
            return result;
        }
    });

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error: error ?? null,
                loginMutation,
                logoutMutation,
                registerMutation,
                verifyRealtorMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
