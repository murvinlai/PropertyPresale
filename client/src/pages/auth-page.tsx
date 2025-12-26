import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { insertUserSchema } from "@shared/schema";
import { Loader2, CheckCircle2 } from "lucide-react";

// Extend the schema for registration validation
const registerSchema = insertUserSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    isRealtor: z.boolean().default(false),
    licenseNumber: z.string().optional(),
    legalName: z.string().optional(),
}).refine((data) => {
    if (data.isRealtor) {
        return !!data.licenseNumber && !!data.legalName;
    }
    return true;
}, {
    message: "License number and legal name are required for realtors",
    path: ["licenseNumber"],
});

export default function AuthPage() {
    const { user, loginMutation, registerMutation, verifyRealtorMutation } = useAuth();
    const [, setLocation] = useLocation();

    // Parse query params to decide initial tab
    const queryParams = new URLSearchParams(window.location.search);
    const initialMode = queryParams.get("mode") === "register" ? "register" : "login";

    const [activeTab, setActiveTab] = useState(initialMode);
    const [verificationStatus, setVerificationStatus] = useState<{
        verified: boolean;
        data?: any;
        error?: string;
    } | null>(null);

    useEffect(() => {
        if (user) {
            setLocation(user.role === "AGENT" ? "/agent" : "/");
        }
    }, [user, setLocation]);

    const loginForm = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            isRealtor: false,
            licenseNumber: "",
            legalName: "",
        },
    });

    const isRealtor = registerForm.watch("isRealtor");
    const licenseNumber = registerForm.watch("licenseNumber");
    const legalName = registerForm.watch("legalName");

    // Reset verification when inputs change
    useEffect(() => {
        setVerificationStatus(null);
    }, [licenseNumber, legalName]);

    const verifyLicense = async () => {
        if (!licenseNumber || !legalName) return;
        try {
            const result = await verifyRealtorMutation.mutateAsync({
                licenseNumber,
                name: legalName
            });
            setVerificationStatus({ verified: true, data: result.details });
        } catch (err: any) {
            setVerificationStatus({ verified: false, error: err.message });
        }
    };

    const onLogin = loginForm.handleSubmit(async (data) => {
        try {
            await loginMutation.mutateAsync(data);
        } catch (error) {
            // handled by mutation error state
        }
    });

    const onRegister = registerForm.handleSubmit(async (data) => {
        try {
            const payload = {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.isRealtor ? "AGENT" : "GUEST",
                licenseNumber: data.isRealtor ? data.licenseNumber : undefined,
                legalName: data.isRealtor ? data.legalName : undefined // Pass legalName for server check
            };
            await registerMutation.mutateAsync(payload);
        } catch (error) {
            // handled
        }
    });

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 bg-zinc-50">
                <Card className="w-full max-w-md shadow-xl border-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            28HSE
                        </CardTitle>
                        <CardDescription>
                            Verified Presale Assignments Marketplace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <Form {...loginForm}>
                                    <form onSubmit={onLogin} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="jdoe" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            {...field}
                                                            placeholder="••••••••"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={loginMutation.isPending}
                                        >
                                            {loginMutation.isPending && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Log In
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>

                            <TabsContent value="register">
                                <Form {...registerForm}>
                                    <form onSubmit={onRegister} className="space-y-4">
                                        <FormField
                                            control={registerForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="jdoe" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={registerForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="email" placeholder="john@example.com" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" {...field} placeholder="••••••••" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={registerForm.control}
                                            name="isRealtor"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            I am a Licensed Realtor
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        {isRealtor && (
                                            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                                                <FormField
                                                    control={registerForm.control}
                                                    name="licenseNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>License Number</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="e.g. 193468" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={registerForm.control}
                                                    name="legalName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Legal Name (as on license)</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="e.g. Carly Miller Smith" onBlur={() => verifyLicense()} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {verifyRealtorMutation.isPending && <div className="text-sm text-blue-600 flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Verifying...</div>}

                                                {verificationStatus?.verified && (
                                                    <div className="text-sm text-green-600 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Verified: {verificationStatus.data.name}
                                                    </div>
                                                )}

                                                {verificationStatus?.error && (
                                                    <div className="text-sm text-red-600">
                                                        Error: {verificationStatus.error}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={registerMutation.isPending || (isRealtor && !verificationStatus?.verified)}
                                        >
                                            {registerMutation.isPending && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Create Account
                                        </Button>
                                    </form>
                                </Form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">28HSE</h1>
                    <p className="text-slate-400">Exclusive Pre-sale Assignments</p>
                </div>
                <div className="relative h-64 w-full bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center text-zinc-600">
                    [Hero Image Placeholder]
                </div>
                <div className="space-y-4">
                    <blockquote className="text-lg font-light italic">
                        "The safest way to trade contract assignments in British Columbia."
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
