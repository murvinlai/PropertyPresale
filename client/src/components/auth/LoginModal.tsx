import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function LoginModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const { loginMutation } = useAuth();

    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        try {
            await loginMutation.mutateAsync(data);
            onClose();
        } catch (error) {
            // Handled by mutation
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription>
                        Log in to your 28HSE account to access verified listings.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4 py-2">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                            className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Log In
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground mt-2">
                    New to 28HSE?{" "}
                    <Link href="/auth?mode=register" onClick={onClose} className="text-blue-600 font-semibold hover:underline">
                        Create an account
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
