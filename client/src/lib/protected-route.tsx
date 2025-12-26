import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
    path,
    component: Component,
    role,
}: {
    path?: string;
    component: React.ComponentType<any>;
    role?: "AGENT" | "ADMIN" | "SUPERADMIN";
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Route path={path} component={() => <Redirect to="/auth" />} />;
    }

    // Check specific role requirement if provided
    if (role) {
        const userRole = user.role;
        if (role === "ADMIN" && userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
            return <Route path={path} component={() => <div className="p-8 text-center text-red-600">Access Denied: Admin Rights Required</div>} />;
        }
        // If asking for AGENT, any role above GUEST usually works, or strictly AGENT? 
        // For now, let's assume if you are ADMIN you can see AGENT screens too, or separate.
        // Based on previous logic: SUPERADMIN > ADMIN > AGENT > GUEST
    }

    return <Route path={path} component={Component} />;
}
